import { app } from 'firebase-admin';
import { Vendor, CreatedBy } from '../../../shared/interface/vendor';
import { CreateVendorDto, UpdateVendorDto, CreateVendorLocationDto, VendorFilterDto } from '../dto/vendor.dto';
export declare class VendorService {
    #private;
    private firebaseApp;
    constructor(firebaseApp: app.App);
    /**
     * Create a new vendor
     *
     * If a logo file is provided, it will be uploaded to
     * GCS bucket `offerapp-bucket` and the resulting public URL
     * will be stored in the `logo` field.
     */
    create(createVendorDto: CreateVendorDto, createdBy: CreatedBy, logoFile?: any): Promise<Vendor>;
    /**
     * Get all vendors with optional filtering
     */
    findAll(filters?: VendorFilterDto): Promise<Vendor[]>;
    /**
     * Get a single vendor by ID
     */
    findOne(id: string): Promise<Vendor>;
    /**
     * Update a vendor by ID. When logoFile is provided, uploads to GCS and sets logo URL.
     */
    update(id: string, updateVendorDto: UpdateVendorDto, logoFile?: any): Promise<Vendor>;
    /**
     * Soft-delete a vendor: set isActive false and isDeleted true (does not remove from DB)
     */
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
    /**
     * Soft delete a vendor by setting isActive to false
     */
    deactivate(id: string): Promise<Vendor>;
    /**
     * Activate a vendor by setting isActive to true
     */
    activate(id: string): Promise<Vendor>;
    /**
     * Search vendors by name or keyword
     */
    search(searchTerm: string): Promise<Vendor[]>;
    /**
     * Add an offer to a vendor
     */
    addOffer(vendorId: string, offerId: string): Promise<Vendor>;
    /**
     * Remove an offer from a vendor
     */
    removeOffer(vendorId: string, offerId: string): Promise<Vendor>;
    /**
     * Add a location to a vendor
     */
    addLocation(vendorId: string, location: CreateVendorLocationDto): Promise<Vendor>;
    /**
     * Remove a location from a vendor
     */
    removeLocation(vendorId: string, locationId: string): Promise<Vendor>;
    /**
     * Update a specific location for a vendor
     */
    updateLocation(vendorId: string, locationId: string, updateData: Partial<CreateVendorLocationDto>): Promise<Vendor>;
    /**
     * Get vendors by offer ID
     */
    findByOffer(offerId: string): Promise<Vendor[]>;
    /**
     * Bulk update vendors
     */
    bulkUpdate(updates: Array<{
        id: string;
        data: UpdateVendorDto;
    }>): Promise<Vendor[]>;
    /**
     * Upload vendor logo file to Google Cloud Storage and return URL.
     *
     * Note: Bucket is using uniform bucket-level access, so we do NOT
     * modify object ACLs here (no makePublic). Access is controlled
     * entirely via bucket-level IAM.
     */
    private uploadLogoToGcs;
}
