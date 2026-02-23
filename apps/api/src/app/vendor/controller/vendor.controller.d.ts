import { VendorService } from '../services/vendor.service';
import { CreateVendorDto, UpdateVendorDto, CreateVendorLocationDto, VendorFilterDto } from '../dto/vendor.dto';
import { Vendor } from '../../../shared/interface/vendor';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    /**
     * Create a new vendor
     * POST /vendor
     */
    create(logo: any, createVendorDto: CreateVendorDto, req: any): Promise<Vendor>;
    /**
     * Get all vendors with optional filters
     * GET /vendor?isActive=true&country=Bahrain
     */
    findAll(filters: VendorFilterDto): Promise<Vendor[]>;
    /**
     * Search vendors by name or keyword
     * GET /vendor/search?searchTerm=vida
     */
    search(searchTerm: string): Promise<Vendor[]>;
    /**
     * Get vendors by offer ID
     * GET /vendor/offer/:offerId
     */
    findByOffer(offerId: string): Promise<Vendor[]>;
    /**
     * Get a single vendor by ID
     * GET /vendor/:id
     */
    findOne(id: string): Promise<Vendor>;
    /**
     * Update a vendor
     * PUT /vendor/:id
     */
    update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor>;
    /**
     * Delete a vendor (soft delete: isActive false, isDeleted true)
     * DELETE /vendor/:id
     */
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
    /**
     * Deactivate a vendor (soft delete)
     * PATCH /vendor/:id/deactivate
     */
    deactivate(id: string): Promise<Vendor>;
    /**
     * Activate a vendor
     * PATCH /vendor/:id/activate
     */
    activate(id: string): Promise<Vendor>;
    /**
     * Add an offer to a vendor
     * POST /vendor/:vendorId/offer/:offerId
     */
    addOffer(vendorId: string, offerId: string): Promise<Vendor>;
    /**
     * Remove an offer from a vendor
     * DELETE /vendor/:vendorId/offer/:offerId
     */
    removeOffer(vendorId: string, offerId: string): Promise<Vendor>;
    /**
     * Add a location to a vendor
     * POST /vendor/:vendorId/location
     */
    addLocation(vendorId: string, location: CreateVendorLocationDto): Promise<Vendor>;
    /**
     * Update a location for a vendor
     * PUT /vendor/:vendorId/location/:locationId
     */
    updateLocation(vendorId: string, locationId: string, updateData: Partial<CreateVendorLocationDto>): Promise<Vendor>;
    /**
     * Remove a location from a vendor
     * DELETE /vendor/:vendorId/location/:locationId
     */
    removeLocation(vendorId: string, locationId: string): Promise<Vendor>;
    /**
     * Bulk update vendors
     * PATCH /vendor/bulk
     */
    bulkUpdate(updates: Array<{
        id: string;
        data: UpdateVendorDto;
    }>): Promise<Vendor[]>;
}
