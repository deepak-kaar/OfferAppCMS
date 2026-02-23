import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { app } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { Vendor, VendorLocation, CreatedBy } from '../../../shared/interface/vendor';
import {
    CreateVendorDto,
    UpdateVendorDto,
    CreateVendorLocationDto,
    VendorFilterDto,
} from '../dto/vendor.dto';

@Injectable()
export class VendorService {
    #db: FirebaseFirestore.Firestore;
    #collection: FirebaseFirestore.CollectionReference;
    #categoryCollection: FirebaseFirestore.CollectionReference;

    constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
        this.#db = firebaseApp.firestore();
        this.#collection = this.#db.collection('vendors');
        this.#categoryCollection = this.#db.collection('categories');
    }

    /**
     * Normalize incoming category IDs to a clean string array.
     *
     * Because of how multipart/form-data is parsed, when only ONE category is
     * selected the value can arrive as a single string instead of a string[].
     * When multiple are selected, it will be a string[].
     */
    private normalizeCategoryIds(raw: unknown): string[] {
        if (Array.isArray(raw)) {
            return raw
                .map(id => (typeof id === 'string' ? id.trim() : ''))
                .filter(id => id.length > 0);
        }

        if (typeof raw === 'string') {
            return raw
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0);
        }

        return [];
    }

    /**
     * Normalize links to string[] for storage and API responses.
     * Multipart/form-data can send links as string or string[]; Firestore may return either.
     */
    private normalizeLinks(raw: unknown): string[] {
        if (Array.isArray(raw)) {
            return raw
                .map(item => (typeof item === 'string' ? item.trim() : String(item).trim()))
                .filter(item => item.length > 0);
        }
        if (typeof raw === 'string') {
            if (raw.trim() === '') return [];
            try {
                const parsed = JSON.parse(raw) as unknown;
                if (Array.isArray(parsed)) {
                    return this.normalizeLinks(parsed);
                }
            } catch {
                // not JSON, treat as single link or comma-separated
            }
            return raw
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);
        }
        return [];
    }

    /**
     * Validate that category IDs exist in the categories collection
     */
    private async validateCategoryIds(categoryIds: string[]): Promise<void> {
        const ids = this.normalizeCategoryIds(categoryIds);
        if (!ids || ids.length === 0) {
            return;
        }

        const categoryDocs = await Promise.all(
            ids.map(id => this.#categoryCollection.doc(id).get())
        );

        const invalidIds = ids.filter((id, index) => !categoryDocs[index].exists);
        if (invalidIds.length > 0) {
            throw new BadRequestException(
                `Invalid category IDs: ${invalidIds.join(', ')}. These categories do not exist.`
            );
        }
    }

    /**
     * Create a new vendor
     *
     * If a logo file is provided, it will be uploaded to
     * GCS bucket `offerapp-bucket` and the resulting public URL
     * will be stored in the `logo` field.
     */
    async create(
        createVendorDto: CreateVendorDto,
        createdBy: CreatedBy,
        logoFile?: any,
    ): Promise<Vendor> {
        try {
            const now = new Date().toISOString();

            // Normalize and validate category IDs if provided
            const normalizedCategories = this.normalizeCategoryIds(
                (createVendorDto as any).categories,
            );
            if (normalizedCategories.length > 0) {
                await this.validateCategoryIds(normalizedCategories);
            }

            let logoUrl = '';
            if (logoFile) {
                logoUrl = await this.uploadLogoToGcs(logoFile);
            }

            const vendorData = {
                name: createVendorDto.name,
                name_ar: createVendorDto.name_ar || '',
                description: createVendorDto.description || '',
                description_ar: createVendorDto.description_ar || '',
                logo: logoUrl,
                crn_no: createVendorDto.crn_no ?? '',
                website: createVendorDto.website || [],
                email: createVendorDto.email || [],
                mobile: createVendorDto.mobile || [],
                telephone: createVendorDto.telephone || [],
                links: this.normalizeLinks((createVendorDto as any).links),
                categories: normalizedCategories,
                offers: [],
                searchKeywords: createVendorDto.searchKeywords || [],
                smeName: createVendorDto.smeName || '',
                smeEmail: createVendorDto.smeEmail || '',
                smePhone: createVendorDto.smePhone || '',
                isActive: true,
                isDeleted: false,
                createdBy,
                createdAt: { $date: now },
                updatedAt: { $date: now },
                __v: 0,
            };

            const docRef = await this.#collection.add(vendorData);
            const vendorId = docRef.id;

            // Parse locations: multipart/form-data sends it as JSON string
            let locationsList: CreateVendorLocationDto[] = [];
            const rawLocations = (createVendorDto as any).locations;
            if (Array.isArray(rawLocations)) {
                locationsList = rawLocations;
            } else if (typeof rawLocations === 'string' && rawLocations.trim()) {
                try {
                    const parsed = JSON.parse(rawLocations);
                    locationsList = Array.isArray(parsed) ? parsed : [];
                } catch {
                    locationsList = [];
                }
            }

            // Store locations in subcollection vendors/{vendorId}/locations
            if (locationsList.length > 0) {
                const locationsCol = this.#collection.doc(vendorId).collection('locations');
                for (const loc of locationsList) {
                    await locationsCol.add({
                        branch_name: loc.branch_name || '',
                        branch_name_ar: loc.branch_name_ar || '',
                        city: loc.city || '',
                        link: loc.link || '',
                        latitude: loc.latitude ?? null,
                        longitude: loc.longitude ?? null,
                        address: loc.address || '',
                        createdAt: { $date: now },
                        updatedAt: { $date: now },
                        __v: 0,
                    });
                }
            }

            return this.findOne(vendorId);
        } catch (error) {
            throw new BadRequestException(`Failed to create vendor: ${error.message}`);
        }
    }

    /**
     * Get all vendors with optional filtering
     */
    async findAll(filters?: VendorFilterDto): Promise<Vendor[]> {
        try {
            let query: FirebaseFirestore.Query = this.#collection;

            console.log('Filters received in service:', filters.isActive);

            if (filters?.isActive !== undefined) {
                query = query.where('isActive', '==', true);
            }

            const snapshot = await query.get();
            const vendors: Vendor[] = [];
            for (const doc of snapshot.docs) {
                const vendorId = doc.id;
                const locations = await this.#getLocationsForVendor(vendorId);
                const data = doc.data() as Omit<Vendor, '_id' | 'locations'>;
                vendors.push({
                    _id: { $oid: vendorId },
                    ...data,
                    links: this.normalizeLinks(data.links),
                    locations,
                });
            }

            // Client-side filtering by country (location city or address) if provided
            if (filters?.country) {
                const filtered = vendors.filter(vendor =>
                    vendor.locations.some(loc =>
                        loc.city?.toLowerCase() === filters.country?.toLowerCase() ||
                        (loc.address && loc.address.toLowerCase().includes(filters.country?.toLowerCase() ?? ''))
                    )
                );
                return filtered;
            }

            return vendors;
        } catch (error) {
            throw new BadRequestException(`Failed to fetch vendors: ${error.message}`);
        }
    }

    /**
     * Get a single vendor by ID (with locations from subcollection)
     */
    async findOne(id: string): Promise<Vendor> {
        try {
            const doc = await this.#collection.doc(id).get();

            if (!doc.exists) {
                throw new NotFoundException(`Vendor with ID ${id} not found`);
            }

            const locations = await this.#getLocationsForVendor(id);
            const data = doc.data() as Omit<Vendor, '_id' | 'locations'>;
            return {
                _id: { $oid: doc.id },
                ...data,
                links: this.normalizeLinks(data.links),
                locations,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to fetch vendor: ${error.message}`);
        }
    }

    /**
     * Fetch locations from vendors/{vendorId}/locations subcollection
     */
    async #getLocationsForVendor(vendorId: string): Promise<VendorLocation[]> {
        const snapshot = await this.#collection.doc(vendorId).collection('locations').get();
        return snapshot.docs.map(doc => {
            const d = doc.data();
            return {
                __id__: { $oid: doc.id },
                branch_name: d.branch_name || '',
                branch_name_ar: d.branch_name_ar || '',
                city: d.city || '',
                link: d.link || '',
                latitude: d.latitude ?? null,
                longitude: d.longitude ?? null,
                address: d.address || '',
                createdAt: d.createdAt || { $date: '' },
                updatedAt: d.updatedAt || { $date: '' },
                __v: d.__v ?? 0,
            };
        });
    }

    /**
     * Get all locations for a vendor by vendor ID
     */
    async getLocationsByVendorId(vendorId: string): Promise<VendorLocation[]> {
        try {
            // Verify vendor exists
            const vendorDoc = await this.#collection.doc(vendorId).get();
            if (!vendorDoc.exists) {
                throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
            }

            return this.#getLocationsForVendor(vendorId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to fetch locations for vendor: ${error.message}`);
        }
    }

    /**
     * Update a vendor by ID. When logoFile is provided, uploads to GCS and sets logo URL.
     */
    async update(id: string, updateVendorDto: UpdateVendorDto, logoFile?: any): Promise<Vendor> {
        try {
            const docRef = this.#collection.doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new NotFoundException(`Vendor with ID ${id} not found`);
            }

            const currentData = doc.data();
            const { locations: _locations, ...restUpdate } = updateVendorDto as UpdateVendorDto & { locations?: VendorLocation[] };

            if (logoFile) {
                const logoUrl = await this.uploadLogoToGcs(logoFile);
                (restUpdate as any).logo = logoUrl;
            }

            const normalizedCategories = this.normalizeCategoryIds(
                (updateVendorDto as any).categories,
            );

            // If categories were provided in the payload, validate & persist them
            if ((updateVendorDto as any).categories !== undefined) {
                if (normalizedCategories.length > 0) {
                    await this.validateCategoryIds(normalizedCategories);
                }
                (restUpdate as any).categories = normalizedCategories;
            }

            if ((restUpdate as any).links !== undefined) {
                (restUpdate as any).links = this.normalizeLinks((restUpdate as any).links);
            }

            const updatedData = {
                ...restUpdate,
                updatedAt: { $date: new Date().toISOString() },
                __v: (currentData.__v || 0) + 1,
            };

            await docRef.update(updatedData);

            return this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update vendor: ${error.message}`);
        }
    }

    /**
     * Soft-delete a vendor: set isActive false and isDeleted true. Does not remove from DB.
     */
    async remove(id: string): Promise<{ message: string; id: string }> {
        try {
            const docRef = this.#collection.doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new NotFoundException(`Vendor with ID ${id} not found`);
            }

            const currentData = doc.data();
            await docRef.update({
                isActive: false,
                isDeleted: true,
                updatedAt: { $date: new Date().toISOString() },
                __v: (currentData.__v || 0) + 1,
            });

            return {
                message: 'Vendor successfully deleted',
                id,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to delete vendor: ${error.message}`);
        }
    }

    /**
     * Deactivate a vendor by setting isActive to false (soft delete).
     * When vendor id is passed, the document is updated with isActive: false.
     */
    async deactivate(id: string): Promise<Vendor> {
        try {
            const docRef = this.#collection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new NotFoundException(`Vendor with ID ${id} not found`);
            }
            const currentData = doc.data();
            await docRef.update({
                isActive: false,
                updatedAt: { $date: new Date().toISOString() },
                __v: (currentData.__v || 0) + 1,
            });
            return this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to deactivate vendor: ${error.message}`);
        }
    }

    /**
     * Activate a vendor: set isActive true and isDeleted false.
     */
    async activate(id: string): Promise<Vendor> {
        try {
            const docRef = this.#collection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new NotFoundException(`Vendor with ID ${id} not found`);
            }
            const currentData = doc.data();
            await docRef.update({
                isActive: true,
                isDeleted: false,
                updatedAt: { $date: new Date().toISOString() },
                __v: (currentData.__v || 0) + 1,
            });
            return this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to activate vendor: ${error.message}`);
        }
    }

    /**
     * Search vendors by name or keyword (with locations from subcollection)
     */
    async search(searchTerm: string): Promise<Vendor[]> {
        try {
            const snapshot = await this.#collection.get();
            const vendors: Vendor[] = [];
            for (const doc of snapshot.docs) {
                const locations = await this.#getLocationsForVendor(doc.id);
                const data = doc.data() as Omit<Vendor, '_id' | 'locations'>;
                vendors.push({
                    _id: { $oid: doc.id },
                    ...data,
                    links: this.normalizeLinks(data.links),
                    locations,
                });
            }

            const searchLower = searchTerm.toLowerCase();
            return vendors.filter(vendor =>
                vendor.name.toLowerCase().includes(searchLower) ||
                vendor.name_ar.toLowerCase().includes(searchLower) ||
                (vendor.searchKeywords && vendor.searchKeywords.some(keyword =>
                    keyword.toLowerCase().includes(searchLower)
                ))
            );
        } catch (error) {
            throw new BadRequestException(`Failed to search vendors: ${error.message}`);
        }
    }

    /**
     * Add an offer to a vendor
     */
    async addOffer(vendorId: string, offerId: string): Promise<Vendor> {
        try {
            const vendor = await this.findOne(vendorId);
            const offers = vendor.offers || [];

            if (!offers.includes(offerId)) {
                offers.push(offerId);
                return this.update(vendorId, { offers });
            }

            return vendor;
        } catch (error) {
            throw new BadRequestException(`Failed to add offer to vendor: ${error.message}`);
        }
    }

    /**
     * Remove an offer from a vendor
     */
    async removeOffer(vendorId: string, offerId: string): Promise<Vendor> {
        try {
            const vendor = await this.findOne(vendorId);
            const updatedOffers = (vendor.offers || []).filter(id => id !== offerId);

            return this.update(vendorId, { offers: updatedOffers });
        } catch (error) {
            throw new BadRequestException(`Failed to remove offer from vendor: ${error.message}`);
        }
    }

    /**
     * Add a location to a vendor (subcollection)
     */
    async addLocation(vendorId: string, location: CreateVendorLocationDto): Promise<Vendor> {
        try {
            await this.findOne(vendorId); // ensure vendor exists
            const now = new Date().toISOString();
            const locationsCol = this.#collection.doc(vendorId).collection('locations');
            await locationsCol.add({
                branch_name: location.branch_name || '',
                branch_name_ar: location.branch_name_ar || '',
                city: location.city || '',
                link: location.link || '',
                latitude: location.latitude ?? null,
                longitude: location.longitude ?? null,
                address: location.address || '',
                createdAt: { $date: now },
                updatedAt: { $date: now },
                __v: 0,
            });
            return this.findOne(vendorId);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(`Failed to add location to vendor: ${error.message}`);
        }
    }

    /**
     * Remove a location from a vendor (subcollection)
     */
    async removeLocation(vendorId: string, locationId: string): Promise<Vendor> {
        try {
            const locRef = this.#collection.doc(vendorId).collection('locations').doc(locationId);
            const locDoc = await locRef.get();
            if (!locDoc.exists) {
                throw new NotFoundException(`Location with ID ${locationId} not found`);
            }
            await locRef.delete();
            return this.findOne(vendorId);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(`Failed to remove location from vendor: ${error.message}`);
        }
    }

    /**
     * Update a specific location for a vendor (subcollection)
     */
    async updateLocation(
        vendorId: string,
        locationId: string,
        updateData: Partial<CreateVendorLocationDto>
    ): Promise<Vendor> {
        try {
            const locRef = this.#collection.doc(vendorId).collection('locations').doc(locationId);
            const locDoc = await locRef.get();
            if (!locDoc.exists) {
                throw new NotFoundException(`Location with ID ${locationId} not found`);
            }
            const now = new Date().toISOString();
            await locRef.update({
                ...(updateData.branch_name !== undefined && { branch_name: updateData.branch_name }),
                ...(updateData.branch_name_ar !== undefined && { branch_name_ar: updateData.branch_name_ar }),
                ...(updateData.city !== undefined && { city: updateData.city }),
                ...(updateData.link !== undefined && { link: updateData.link }),
                ...(updateData.latitude !== undefined && { latitude: updateData.latitude }),
                ...(updateData.longitude !== undefined && { longitude: updateData.longitude }),
                ...(updateData.address !== undefined && { address: updateData.address }),
                updatedAt: { $date: now },
                __v: (locDoc.data()?.__v ?? 0) + 1,
            });
            return this.findOne(vendorId);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(`Failed to update location: ${error.message}`);
        }
    }

    /**
     * Get vendors by offer ID (with locations from subcollection)
     */
    async findByOffer(offerId: string): Promise<Vendor[]> {
        try {
            const snapshot = await this.#collection.where('offers', 'array-contains', offerId).get();
            const vendors: Vendor[] = [];
            for (const doc of snapshot.docs) {
                const locations = await this.#getLocationsForVendor(doc.id);
                const data = doc.data() as Omit<Vendor, '_id' | 'locations'>;
                vendors.push({
                    _id: { $oid: doc.id },
                    ...data,
                    links: this.normalizeLinks(data.links),
                    locations,
                });
            }
            return vendors;
        } catch (error) {
            throw new BadRequestException(`Failed to fetch vendors by offer: ${error.message}`);
        }
    }

    /**
     * Bulk update vendors
     */
    async bulkUpdate(updates: Array<{ id: string; data: UpdateVendorDto }>): Promise<Vendor[]> {
        try {
            const batch = this.#db.batch();
            const now = new Date().toISOString();

            for (const update of updates) {
                const docRef = this.#collection.doc(update.id);
                const doc = await docRef.get();

                if (doc.exists) {
                    const currentData = doc.data();
                    const { locations: _locations, ...restData } = update.data as UpdateVendorDto & { locations?: VendorLocation[] };
                    batch.update(docRef, {
                        ...restData,
                        updatedAt: { $date: now },
                        __v: (currentData.__v || 0) + 1,
                    });
                }
            }

            await batch.commit();

            // Fetch and return updated vendors
            const updatedVendors = await Promise.all(
                updates.map(update => this.findOne(update.id))
            );

            return updatedVendors;
        } catch (error) {
            throw new BadRequestException(`Failed to bulk update vendors: ${error.message}`);
        }
    }

    /**
     * Extract latitude and longitude from a Google Maps URL (short or full).
     * Used by the create-vendor form to validate the link and prefill coordinates.
     */
    async getCoordinatesFromMapUrl(url: string): Promise<{ latitude: number; longitude: number } | null> {
        if (!url || typeof url !== 'string' || !url.trim()) {
            return null;
        }
        const trimmed = url.trim();
        try {
            // Direct parse: full Google Maps URL with @lat,lng
            const directMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (directMatch) {
                return {
                    latitude: parseFloat(directMatch[1]),
                    longitude: parseFloat(directMatch[2]),
                };
            }
            const queryMatch = trimmed.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (queryMatch) {
                return {
                    latitude: parseFloat(queryMatch[1]),
                    longitude: parseFloat(queryMatch[2]),
                };
            }
            // Short URL: follow redirect
            const response = await fetch(trimmed, { method: 'HEAD', redirect: 'follow' });
            const fullUrl = response.url;
            const redirectMatch = fullUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (redirectMatch) {
                return {
                    latitude: parseFloat(redirectMatch[1]),
                    longitude: parseFloat(redirectMatch[2]),
                };
            }
            // Fallback: fetch HTML and parse
            const htmlResponse = await fetch(trimmed, { redirect: 'follow' });
            const html = await htmlResponse.text();
            const htmlMatch1 = html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
            if (htmlMatch1) {
                return {
                    latitude: parseFloat(htmlMatch1[1]),
                    longitude: parseFloat(htmlMatch1[2]),
                };
            }
            const htmlMatch2 = html.match(/"center":\[(-?\d+\.\d+),(-?\d+\.\d+)\]/);
            if (htmlMatch2) {
                return {
                    latitude: parseFloat(htmlMatch2[1]),
                    longitude: parseFloat(htmlMatch2[2]),
                };
            }
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Upload vendor logo file to Google Cloud Storage and return URL.
     *
     * Note: Bucket is using uniform bucket-level access, so we do NOT
     * modify object ACLs here (no makePublic). Access is controlled
     * entirely via bucket-level IAM.
     */
    private async uploadLogoToGcs(file: any): Promise<string> {
        try {
            const storage = getStorage(this.firebaseApp as any);
            const bucket = storage.bucket('offerapp-bucket');

            const timestamp = Date.now();
            const safeOriginalName = (file.originalname || 'logo').replace(/\s+/g, '_');
            const fileName = `vendors/logos/${timestamp}-${safeOriginalName}`;
            const fileUpload = bucket.file(fileName);

            // If file buffer is available (memory storage)
            if (file.buffer) {
                await fileUpload.save(file.buffer, {
                    contentType: file.mimetype,
                    metadata: {
                        cacheControl: 'public,max-age=31536000',
                    },
                });
            } else {
                // Fallback: create a stream from the file
                await new Promise<void>((resolve, reject) => {
                    const stream = fileUpload.createWriteStream({
                        metadata: {
                            contentType: file.mimetype,
                            cacheControl: 'public,max-age=31536000',
                        },
                    });

                    stream.on('error', (err) => reject(err));
                    stream.on('finish', () => resolve());

                    if (file.stream) {
                        file.stream.pipe(stream);
                    } else {
                        stream.end(file.buffer);
                    }
                });
            }

            // Just return the object URL; access is managed by bucket IAM
            return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        } catch (error) {
            throw new BadRequestException(`Failed to upload logo to storage: ${error.message}`);
        }
    }
}
