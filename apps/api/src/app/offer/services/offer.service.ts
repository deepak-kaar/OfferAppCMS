import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { app } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { Offer, OfferLocation, OfferCategory, OfferVendor } from '../../../shared/interface/offer';
import {
    CreateOfferDto,
    UpdateOfferDto,
    OfferFilterDto,
} from '../dto/offer.dto';

@Injectable()
export class OfferService {
    #db: FirebaseFirestore.Firestore;
    #collection: FirebaseFirestore.CollectionReference;
    #vendorCollection: FirebaseFirestore.CollectionReference;
    #categoryCollection: FirebaseFirestore.CollectionReference;

    constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
        this.#db = firebaseApp.firestore();
        this.#collection = this.#db.collection('offers');
        this.#vendorCollection = this.#db.collection('vendors');
        this.#categoryCollection = this.#db.collection('categories');
    }

    /**
     * Create a new offer
     *
     * If an image file is provided, it will be uploaded to
     * GCS bucket `offerapp-bucket` and the resulting public URL
     * will be stored in the `image` field.
     */
    async create(
        createOfferDto: CreateOfferDto,
        imageFile?: any,
        featuredImageFile?: any,
    ): Promise<Offer> {
        try {
            // Validate vendor exists
            const vendorDoc = await this.#vendorCollection.doc(createOfferDto.vendorId).get();
            if (!vendorDoc.exists) {
                throw new NotFoundException(`Vendor with ID ${createOfferDto.vendorId} not found`);
            }

            const now = new Date().toISOString();

            const vendorData = vendorDoc.data();
            const vendor: OfferVendor = {
                _id: { $oid: vendorDoc.id },
                name: vendorData.name || '',
                email: Array.isArray(vendorData.email) ? vendorData.email : (vendorData.email ? [vendorData.email] : []),
                mobile: Array.isArray(vendorData.mobile) ? vendorData.mobile : (vendorData.mobile ? [vendorData.mobile] : []),
            };

            // Get category data if provided
            let category: OfferCategory | null = null;
            if (createOfferDto.categoryId) {
                const categoryDoc = await this.#categoryCollection.doc(createOfferDto.categoryId).get();
                if (categoryDoc.exists) {
                    const categoryData = categoryDoc.data();
                    category = {
                        _id: { $oid: categoryDoc.id },
                        icon: categoryData.icon || '',
                        image: categoryData.image || '',
                        name: categoryData.name || '',
                        name_ar: categoryData.name_ar || '',
                        order: categoryData.order || 0,
                        createdAt: categoryData.createdAt || { $date: now },
                        updatedAt: categoryData.updatedAt || { $date: now },
                    };
                }
            }

            // Upload images if provided
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await this.uploadImageToGcs(imageFile, 'offers/images');
            }

            let featuredImageUrl = '';
            if (featuredImageFile) {
                featuredImageUrl = await this.uploadImageToGcs(featuredImageFile, 'offers/featured');
            }

            const offerData = {
                vendor,
                category,
                title: createOfferDto.title,
                title_ar: createOfferDto.title_ar || '',
                description: createOfferDto.description,
                description_ar: createOfferDto.description_ar || '',
                highlights: createOfferDto.highlights || '',
                highlights_ar: createOfferDto.highlights_ar || '',
                howToAvail: createOfferDto.howToAvail,
                howToAvail_ar: createOfferDto.howToAvail_ar || '',
                discountType: createOfferDto.discountType,
                discountCode: createOfferDto.discountCode || '',
                discount_url: createOfferDto.discount_url || '',
                offerType: createOfferDto.offerType,
                startDate: { $date: new Date(createOfferDto.startDate).toISOString() },
                expiryDate: { $date: new Date(createOfferDto.expiryDate).toISOString() },
                image: imageUrl || createOfferDto.image || '',
                featuredImage: featuredImageUrl || createOfferDto.featuredImage || '',
                isActive: createOfferDto.isActive !== undefined ? createOfferDto.isActive : true,
                isFeatured: createOfferDto.isFeatured !== undefined ? createOfferDto.isFeatured : false,
                isOccasional: createOfferDto.isOccasional !== undefined ? createOfferDto.isOccasional : false,
                isPartnerHotel: createOfferDto.isPartnerHotel !== undefined ? createOfferDto.isPartnerHotel : false,
                hotelStarRating: createOfferDto.hotelStarRating !== undefined ? createOfferDto.hotelStarRating : false,
                hotelAmenitites: createOfferDto.hotelAmenitites || [],
                rooms: createOfferDto.rooms || null,
                currency: createOfferDto.currency || '',
                currency_ar: createOfferDto.currency_ar || null,
                taxValue: createOfferDto.taxValue || '',
                taxValue_ar: createOfferDto.taxValue_ar || '',
                website: createOfferDto.website || '',
                email: createOfferDto.email || [],
                mobile: createOfferDto.mobile || [],
                telephone: createOfferDto.telephone || [],
                contacts: createOfferDto.contacts || [],
                enableMapSearch: createOfferDto.enableMapSearch !== undefined ? createOfferDto.enableMapSearch : true,
                searchKeywords: createOfferDto.searchKeywords || [],
                tags: createOfferDto.tags || [],
                createdByRole: createOfferDto.createdByRole || 'Personnel',
                createdAt: { $date: now },
                updatedAt: { $date: now },
                __v: 0,
            };

            const docRef = await this.#collection.add(offerData);
            const doc = await docRef.get();

            // Update vendor's offers array
            const vendorOffers = vendorData.offers || [];
            if (!vendorOffers.includes(doc.id)) {
                vendorOffers.push(doc.id);
                await this.#vendorCollection.doc(createOfferDto.vendorId).update({
                    offers: vendorOffers,
                    updatedAt: { $date: now },
                });
            }

            return {
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Offer, '_id'>,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to create offer: ${error.message}`);
        }
    }

    /**
     * Get all offers with optional filtering
     */
    async findAll(filters?: OfferFilterDto): Promise<Offer[]> {
        try {
            let query: FirebaseFirestore.Query = this.#collection;

            if (filters?.isActive !== undefined) {
                query = query.where('isActive', '==', filters.isActive);
            }

            if (filters?.isFeatured !== undefined) {
                query = query.where('isFeatured', '==', filters.isFeatured);
            }

            if (filters?.discountType) {
                query = query.where('discountType', '==', filters.discountType);
            }

            if (filters?.offerType) {
                query = query.where('offerType', '==', filters.offerType);
            }

            const snapshot = await query.get();
            let offers = snapshot.docs.map(doc => ({
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Offer, '_id'>,
            }));

            // Client-side filtering for complex queries
            if (filters?.vendorId) {
                offers = offers.filter(offer => offer.vendor?._id?.$oid === filters.vendorId);
            }

            if (filters?.categoryId) {
                offers = offers.filter(offer => offer.category?._id?.$oid === filters.categoryId);
            }

            // Filter by vendor location (country/city): resolve vendor IDs from vendors collection
            if (filters?.country || filters?.city) {
                const vendorIds = await this.getVendorIdsByLocation(filters.country, filters.city);
                if (vendorIds.length > 0) {
                    const set = new Set(vendorIds);
                    offers = offers.filter(offer => offer.vendor?._id?.$oid && set.has(offer.vendor._id.$oid));
                } else {
                    offers = [];
                }
            }

            if (filters?.tag) {
                offers = offers.filter(offer =>
                    offer.tags.includes(filters.tag)
                );
            }

            return offers;
        } catch (error) {
            throw new BadRequestException(`Failed to fetch offers: ${error.message}`);
        }
    }

    /**
     * Get a single offer by ID
     */
    async findOne(id: string): Promise<Offer> {
        try {
            const doc = await this.#collection.doc(id).get();

            if (!doc.exists) {
                throw new NotFoundException(`Offer with ID ${id} not found`);
            }

            return {
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Offer, '_id'>,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to fetch offer: ${error.message}`);
        }
    }

    /**
     * Update an offer by ID
     */
    async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
        try {
            const docRef = this.#collection.doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new NotFoundException(`Offer with ID ${id} not found`);
            }

            const currentData = doc.data();
            const now = new Date().toISOString();

            // Handle vendor change: store only id, name, email, mobile
            let vendorData = currentData.vendor;
            if (updateOfferDto.vendorId && updateOfferDto.vendorId !== currentData.vendor?._id?.$oid) {
                const vendorDoc = await this.#vendorCollection.doc(updateOfferDto.vendorId).get();
                if (!vendorDoc.exists) {
                    throw new NotFoundException(`Vendor with ID ${updateOfferDto.vendorId} not found`);
                }

                const newVendorData = vendorDoc.data();
                vendorData = {
                    _id: { $oid: vendorDoc.id },
                    name: newVendorData.name || '',
                    email: Array.isArray(newVendorData.email) ? newVendorData.email : (newVendorData.email ? [newVendorData.email] : []),
                    mobile: Array.isArray(newVendorData.mobile) ? newVendorData.mobile : (newVendorData.mobile ? [newVendorData.mobile] : []),
                };

                // Remove offer from old vendor
                if (currentData.vendor?._id?.$oid) {
                    const oldVendorDoc = await this.#vendorCollection.doc(currentData.vendor._id.$oid).get();
                    if (oldVendorDoc.exists) {
                        const oldVendorData = oldVendorDoc.data();
                        const updatedOffers = (oldVendorData.offers || []).filter(offerId => offerId !== id);
                        await this.#vendorCollection.doc(currentData.vendor._id.$oid).update({
                            offers: updatedOffers,
                            updatedAt: { $date: now },
                        });
                    }
                }

                // Add offer to new vendor
                const newVendorOffers = newVendorData.offers || [];
                if (!newVendorOffers.includes(id)) {
                    newVendorOffers.push(id);
                    await this.#vendorCollection.doc(updateOfferDto.vendorId).update({
                        offers: newVendorOffers,
                        updatedAt: { $date: now },
                    });
                }
            }

            // Handle category change
            let categoryData = currentData.category;
            if (updateOfferDto.categoryId) {
                const categoryDoc = await this.#categoryCollection.doc(updateOfferDto.categoryId).get();
                if (categoryDoc.exists) {
                    const catData = categoryDoc.data();
                    categoryData = {
                        _id: { $oid: categoryDoc.id },
                        icon: catData.icon || '',
                        image: catData.image || '',
                        name: catData.name || '',
                        name_ar: catData.name_ar || '',
                        order: catData.order || 0,
                        createdAt: catData.createdAt || { $date: now },
                        updatedAt: catData.updatedAt || { $date: now },
                    };
                }
            }

            const updatedData: any = {
                ...updateOfferDto,
                updatedAt: { $date: now },
                __v: (currentData.__v || 0) + 1,
            };

            // Handle date fields
            if (updateOfferDto.startDate) {
                updatedData.startDate = { $date: new Date(updateOfferDto.startDate).toISOString() };
            }

            if (updateOfferDto.expiryDate) {
                updatedData.expiryDate = { $date: new Date(updateOfferDto.expiryDate).toISOString() };
            }

            // Update vendor and category if changed
            if (vendorData) {
                updatedData.vendor = vendorData;
            }

            if (categoryData) {
                updatedData.category = categoryData;
            }

            // Remove vendorId and categoryId from update as they're stored as objects
            delete updatedData.vendorId;
            delete updatedData.categoryId;

            await docRef.update(updatedData);

            return this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update offer: ${error.message}`);
        }
    }

    /**
     * Delete an offer by ID (hard delete)
     */
    async remove(id: string): Promise<{ message: string; id: string }> {
        try {
            const doc = await this.#collection.doc(id).get();

            if (!doc.exists) {
                throw new NotFoundException(`Offer with ID ${id} not found`);
            }

            const offerData = doc.data();

            // Remove offer from vendor's offers array
            if (offerData.vendor?._id?.$oid) {
                const vendorDoc = await this.#vendorCollection.doc(offerData.vendor._id.$oid).get();
                if (vendorDoc.exists) {
                    const vendorData = vendorDoc.data();
                    const updatedOffers = (vendorData.offers || []).filter(offerId => offerId !== id);
                    await this.#vendorCollection.doc(offerData.vendor._id.$oid).update({
                        offers: updatedOffers,
                        updatedAt: { $date: new Date().toISOString() },
                    });
                }
            }

            await this.#collection.doc(id).delete();

            return {
                message: 'Offer successfully deleted',
                id,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to delete offer: ${error.message}`);
        }
    }

    /**
     * Soft delete an offer by setting isActive to false
     */
    async deactivate(id: string): Promise<Offer> {
        try {
            return this.update(id, { isActive: false });
        } catch (error) {
            throw new BadRequestException(`Failed to deactivate offer: ${error.message}`);
        }
    }

    /**
     * Activate an offer by setting isActive to true
     */
    async activate(id: string): Promise<Offer> {
        try {
            return this.update(id, { isActive: true });
        } catch (error) {
            throw new BadRequestException(`Failed to activate offer: ${error.message}`);
        }
    }

    /**
     * Search offers by title or keyword
     */
    async search(searchTerm: string): Promise<Offer[]> {
        try {
            const snapshot = await this.#collection.get();
            const offers = snapshot.docs.map(doc => ({
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Offer, '_id'>,
            }));

            const searchLower = searchTerm.toLowerCase();

            return offers.filter(offer =>
                offer.title.toLowerCase().includes(searchLower) ||
                offer.title_ar.toLowerCase().includes(searchLower) ||
                offer.description.toLowerCase().includes(searchLower) ||
                offer.description_ar.toLowerCase().includes(searchLower) ||
                offer.searchKeywords.some(keyword =>
                    keyword.toLowerCase().includes(searchLower)
                ) ||
                offer.tags.some(tag =>
                    tag.toLowerCase().includes(searchLower)
                )
            );
        } catch (error) {
            throw new BadRequestException(`Failed to search offers: ${error.message}`);
        }
    }

    /**
     * Get offers by vendor ID
     */
    async findByVendor(vendorId: string): Promise<Offer[]> {
        try {
            const snapshot = await this.#collection.get();
            const offers = snapshot.docs.map(doc => ({
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Offer, '_id'>,
            }));

            return offers.filter(offer => offer.vendor?._id?.$oid === vendorId);
        } catch (error) {
            throw new BadRequestException(`Failed to fetch offers by vendor: ${error.message}`);
        }
    }

    /**
     * Get offers by category ID
     */
    async findByCategory(categoryId: string): Promise<Offer[]> {
        try {
            const snapshot = await this.#collection.get();
            const offers = snapshot.docs.map(doc => ({
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Offer, '_id'>,
            }));

            return offers.filter(offer => offer.category?._id?.$oid === categoryId);
        } catch (error) {
            throw new BadRequestException(`Failed to fetch offers by category: ${error.message}`);
        }
    }

    /**
     * Bulk update offers
     */
    async bulkUpdate(updates: Array<{ id: string; data: UpdateOfferDto }>): Promise<Offer[]> {
        try {
            const batch = this.#db.batch();
            const now = new Date().toISOString();

            for (const update of updates) {
                const docRef = this.#collection.doc(update.id);
                const doc = await docRef.get();

                if (doc.exists) {
                    const currentData = doc.data();
                    batch.update(docRef, {
                        ...update.data,
                        updatedAt: { $date: now },
                        __v: (currentData.__v || 0) + 1,
                    });
                }
            }

            await batch.commit();

            // Fetch and return updated offers
            const updatedOffers = await Promise.all(
                updates.map(update => this.findOne(update.id))
            );

            return updatedOffers;
        } catch (error) {
            throw new BadRequestException(`Failed to bulk update offers: ${error.message}`);
        }
    }

    /**
     * Get vendor IDs that have locations matching the given country and/or city.
     * Used for offer filtering (vendor snapshot on offer stores only id, name, email, mobile).
     */
    private async getVendorIdsByLocation(country?: string, city?: string): Promise<string[]> {
        if (!country && !city) return [];
        const snapshot = await this.#vendorCollection.get();
        const c = (country || '').toLowerCase();
        const t = (city || '').toLowerCase();
        const ids: string[] = [];
        for (const doc of snapshot.docs) {
            const locsSnap = await doc.ref.collection('locations').get();
            const locations = locsSnap.docs.map(d => d.data());
            const matchesCountry = !country || locations.some((loc: any) =>
                (loc.city || '').toLowerCase() === c || (loc.address || '').toLowerCase().includes(c));
            const matchesCity = !city || locations.some((loc: any) =>
                (loc.city || '').toLowerCase() === t || (loc.address || '').toLowerCase().includes(t));
            if (matchesCountry && matchesCity) ids.push(doc.id);
        }
        return ids;
    }

    /**
     * Fetch vendor locations from vendors/{vendorId}/locations subcollection and map to OfferLocation[]
     */
    private async getVendorLocationsForOffer(vendorId: string): Promise<OfferLocation[]> {
        const snapshot = await this.#vendorCollection.doc(vendorId).collection('locations').get();
        return snapshot.docs.map(doc => {
            const d = doc.data();
            return {
                _id: { $oid: doc.id },
                city: d.city || '',
                city_ar: d.branch_name_ar || '',
                country: '',
                country_ar: '',
                latitude: d.latitude ?? null,
                longitude: d.longitude ?? null,
                createdAt: d.createdAt || { $date: '' },
                updatedAt: d.updatedAt || { $date: '' },
                __v: d.__v ?? 0,
            };
        });
    }

    /**
     * Upload offer image file to Google Cloud Storage and return URL.
     */
    private async uploadImageToGcs(file: any, folder: string): Promise<string> {
        try {
            const storage = getStorage(this.firebaseApp as any);
            const bucket = storage.bucket('offerapp-bucket');

            const timestamp = Date.now();
            const safeOriginalName = (file.originalname || 'image').replace(/\s+/g, '_');
            const fileName = `${folder}/${timestamp}-${safeOriginalName}`;
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
            throw new BadRequestException(`Failed to upload image to storage: ${error.message}`);
        }
    }
}
