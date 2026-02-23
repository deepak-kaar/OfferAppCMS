import {
    BadRequestException,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiBearerAuth,
    ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { VendorService } from '../services/vendor.service';
import {
    CreateVendorDto,
    UpdateVendorDto,
    CreateVendorLocationDto,
    VendorFilterDto,
} from '../dto/vendor.dto';
import { Vendor, VendorLocation } from '../../../shared/interface/vendor';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@ApiTags('vendor')
@Controller('vendor')
export class VendorController {
    constructor(private readonly vendorService: VendorService) {}

    /**
     * Create a new vendor
     * POST /vendor
     */
    @Post()
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new vendor',
        description: 'Creates a new vendor with the provided details. Requires an admin JWT (role: admin).',
    })
    @ApiResponse({ status: 201, description: 'Vendor successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid vendor data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Vendor data with optional logo file upload',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Vida Hotel' },
                name_ar: { type: 'string', example: 'فندق فيدا' },
                description: { type: 'string' },
                description_ar: { type: 'string' },
                website: {
                    type: 'array',
                    items: { type: 'string' },
                },
                crn_no: { type: 'string', example: 'CRN123456' },
                email: {
                    type: 'array',
                    items: { type: 'string' },
                },
                mobile: {
                    type: 'array',
                    items: { type: 'string' },
                },
                telephone: {
                    type: 'array',
                    items: { type: 'string' },
                },
                links: {
                    type: 'array',
                    items: { type: 'string' },
                },
                locations: {
                    type: 'array',
                    description: 'Locations stored in subcollection; each item: branch_name, branch_name_ar, city, link, latitude, longitude, address',
                    items: {
                        type: 'object',
                        properties: {
                            branch_name: { type: 'string' },
                            branch_name_ar: { type: 'string' },
                            city: { type: 'string' },
                            link: { type: 'string' },
                            latitude: { type: 'number', nullable: true },
                            longitude: { type: 'number', nullable: true },
                            address: { type: 'string' },
                        },
                    },
                },
                categories: {
                    type: 'array',
                    description: 'Array of category IDs to assign to the vendor',
                    items: { type: 'string' },
                    example: ['61d2d9d51924c27a9ed5128b', '61d2d9d51924c27a9ed5128c'],
                },
                searchKeywords: {
                    type: 'array',
                    items: { type: 'string' },
                },
                smeName: { type: 'string' },
                smeEmail: { type: 'string' },
                smePhone: { type: 'string' },
                logo: {
                    type: 'string',
                    format: 'binary',
                    description: 'Logo image file to upload',
                },
            },
            required: ['name', 'crn_no'],
        },
    })
    @UseInterceptors(
        FileInterceptor('logo', {
            storage: memoryStorage(),
        }),
    )
    async create(
        @UploadedFile() logo: any,
        @Body() createVendorDto: CreateVendorDto,
        @Req() req: any,
    ): Promise<Vendor> {
        const createdBy = {
            networkId: req.user?.networkId || 'unknown',
            name: req.user?.name || 'unknown',
        };
        return this.vendorService.create(createVendorDto, createdBy, logo);
    }

    /**
     * Get all vendors with optional filters
     * GET /vendor?isActive=true&country=Bahrain
     */
    @Get()
    @ApiOperation({ summary: 'Get all vendors', description: 'Retrieve all vendors with optional filters for active status and country' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
    @ApiQuery({ name: 'country', required: false, type: String, description: 'Filter by country name' })
    @ApiResponse({ status: 200, description: 'List of vendors retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findAll(@Query() filters: VendorFilterDto): Promise<Vendor[]> {
        return this.vendorService.findAll(filters);
    }

    /**
     * Search vendors by name or keyword
     * GET /vendor/search?searchTerm=vida
     */
    @Get('search')
    @ApiOperation({ summary: 'Search vendors', description: 'Search vendors by name (English/Arabic) or keywords' })
    @ApiQuery({ name: 'searchTerm', required: true, type: String, description: 'Search term for vendor name or keywords' })
    @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async search(@Query('searchTerm') searchTerm: string): Promise<Vendor[]> {
        return this.vendorService.search(searchTerm);
    }

    /**
     * Get vendors by offer ID
     * GET /vendor/offer/:offerId
     */
    @Get('offer/:offerId')
    @ApiOperation({ summary: 'Get vendors by offer', description: 'Retrieve all vendors that have a specific offer' })
    @ApiParam({ name: 'offerId', description: 'The ID of the offer', type: String })
    @ApiResponse({ status: 200, description: 'Vendors with the specified offer retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findByOffer(@Param('offerId') offerId: string): Promise<Vendor[]> {
        return this.vendorService.findByOffer(offerId);
    }

    /**
     * Get latitude/longitude from a Google Maps URL
     * GET /vendor/map-url-coordinates?url=https://maps.app.goo.gl/...
     */
    @Get('map-url-coordinates')
    @ApiOperation({ summary: 'Get coordinates from Google Maps URL', description: 'Extract latitude and longitude from a Google Maps (or short) URL' })
    @ApiQuery({ name: 'url', required: true, type: String, description: 'Google Maps URL (short or full)' })
    @ApiResponse({ status: 200, description: 'Coordinates extracted successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or unsupported URL' })
    async getCoordinatesFromMapUrl(@Query('url') url: string): Promise<{ latitude: number; longitude: number }> {
        const coords = await this.vendorService.getCoordinatesFromMapUrl(url);
        if (coords == null) {
            throw new BadRequestException('Could not extract coordinates from the provided map link.');
        }
        return coords;
    }

    /**
     * Get locations by vendor ID
     * GET /vendor/:vendorId/locations
     */
    @Get(':vendorId/locations')
    @ApiOperation({ summary: 'Get locations by vendor ID', description: 'Retrieve all locations for a specific vendor' })
    @ApiParam({ name: 'vendorId', description: 'The ID of the vendor', type: String })
    @ApiResponse({ status: 200, description: 'Locations retrieved successfully', type: [Object] })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getLocationsByVendorId(@Param('vendorId') vendorId: string): Promise<VendorLocation[]> {
        return this.vendorService.getLocationsByVendorId(vendorId);
    }

    /**
     * Get a single vendor by ID
     * GET /vendor/:id
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get vendor by ID', description: 'Retrieve a single vendor by its ID' })
    @ApiParam({ name: 'id', description: 'Vendor ID', type: String })
    @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findOne(@Param('id') id: string): Promise<Vendor> {
        return this.vendorService.findOne(id);
    }

    /**
     * Update a vendor. Accepts JSON or multipart/form-data with optional logo file.
     * PUT /vendor/:id
     */
    @Put(':id')
    @UseInterceptors(
        FileInterceptor('logo', {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    @ApiOperation({ summary: 'Update vendor', description: 'Update an existing vendor by ID. Send multipart/form-data when updating logo with a new file.' })
    @ApiParam({ name: 'id', description: 'Vendor ID', type: String })
    @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid update data' })
    async update(
        @Param('id') id: string,
        @Body() updateVendorDto: UpdateVendorDto,
        @UploadedFile() logo?: any,
    ): Promise<Vendor> {
        return this.vendorService.update(id, updateVendorDto, logo);
    }

    /**
     * Delete a vendor (soft delete: isActive false, isDeleted true; vendor remains in DB)
     * DELETE /vendor/:id
     */
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete vendor', description: 'Soft-delete a vendor by setting isActive to false and isDeleted to true (vendor is not removed from DB)' })
    @ApiParam({ name: 'id', description: 'Vendor ID', type: String })
    @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async remove(@Param('id') id: string): Promise<{ message: string; id: string }> {
        return this.vendorService.remove(id);
    }

    /**
     * Deactivate a vendor (soft delete)
     * PATCH /vendor/:id/deactivate
     */
    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Deactivate vendor', description: 'Deactivate a vendor (soft delete) by setting isActive to false' })
    @ApiParam({ name: 'id', description: 'Vendor ID', type: String })
    @ApiResponse({ status: 200, description: 'Vendor deactivated successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async deactivate(@Param('id') id: string): Promise<Vendor> {
        return this.vendorService.deactivate(id);
    }

    /**
     * Activate a vendor
     * PATCH /vendor/:id/activate
     */
    @Patch(':id/activate')
    @ApiOperation({ summary: 'Activate vendor', description: 'Activate a vendor by setting isActive to true' })
    @ApiParam({ name: 'id', description: 'Vendor ID', type: String })
    @ApiResponse({ status: 200, description: 'Vendor activated successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async activate(@Param('id') id: string): Promise<Vendor> {
        return this.vendorService.activate(id);
    }

    /**
     * Add an offer to a vendor
     * POST /vendor/:vendorId/offer/:offerId
     */
    @Post(':vendorId/offer/:offerId')
    @ApiOperation({ summary: 'Add offer to vendor', description: 'Associate an offer with a vendor' })
    @ApiParam({ name: 'vendorId', description: 'Vendor ID', type: String })
    @ApiParam({ name: 'offerId', description: 'Offer ID to add', type: String })
    @ApiResponse({ status: 200, description: 'Offer added to vendor successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async addOffer(
        @Param('vendorId') vendorId: string,
        @Param('offerId') offerId: string
    ): Promise<Vendor> {
        return this.vendorService.addOffer(vendorId, offerId);
    }

    /**
     * Remove an offer from a vendor
     * DELETE /vendor/:vendorId/offer/:offerId
     */
    @Delete(':vendorId/offer/:offerId')
    @ApiOperation({ summary: 'Remove offer from vendor', description: 'Remove an offer association from a vendor' })
    @ApiParam({ name: 'vendorId', description: 'Vendor ID', type: String })
    @ApiParam({ name: 'offerId', description: 'Offer ID to remove', type: String })
    @ApiResponse({ status: 200, description: 'Offer removed from vendor successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async removeOffer(
        @Param('vendorId') vendorId: string,
        @Param('offerId') offerId: string
    ): Promise<Vendor> {
        return this.vendorService.removeOffer(vendorId, offerId);
    }

    /**
     * Add a location to a vendor
     * POST /vendor/:vendorId/location
     */
    @Post(':vendorId/location')
    @ApiOperation({ summary: 'Add location to vendor', description: 'Add a new location to a vendor' })
    @ApiParam({ name: 'vendorId', description: 'Vendor ID', type: String })
    @ApiResponse({ status: 200, description: 'Location added to vendor successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid location data' })
    async addLocation(
        @Param('vendorId') vendorId: string,
        @Body() location: CreateVendorLocationDto
    ): Promise<Vendor> {
        return this.vendorService.addLocation(vendorId, location);
    }

    /**
     * Update a location for a vendor
     * PUT /vendor/:vendorId/location/:locationId
     */
    @Put(':vendorId/location/:locationId')
    @ApiOperation({ summary: 'Update vendor location', description: 'Update a specific location for a vendor' })
    @ApiParam({ name: 'vendorId', description: 'Vendor ID', type: String })
    @ApiParam({ name: 'locationId', description: 'Location ID', type: String })
    @ApiResponse({ status: 200, description: 'Location updated successfully' })
    @ApiResponse({ status: 404, description: 'Vendor or location not found' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid location data' })
    async updateLocation(
        @Param('vendorId') vendorId: string,
        @Param('locationId') locationId: string,
        @Body() updateData: Partial<CreateVendorLocationDto>
    ): Promise<Vendor> {
        return this.vendorService.updateLocation(vendorId, locationId, updateData);
    }

    /**
     * Remove a location from a vendor
     * DELETE /vendor/:vendorId/location/:locationId
     */
    @Delete(':vendorId/location/:locationId')
    @ApiOperation({ summary: 'Remove location from vendor', description: 'Remove a location from a vendor' })
    @ApiParam({ name: 'vendorId', description: 'Vendor ID', type: String })
    @ApiParam({ name: 'locationId', description: 'Location ID', type: String })
    @ApiResponse({ status: 200, description: 'Location removed successfully' })
    @ApiResponse({ status: 404, description: 'Vendor or location not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async removeLocation(
        @Param('vendorId') vendorId: string,
        @Param('locationId') locationId: string
    ): Promise<Vendor> {
        return this.vendorService.removeLocation(vendorId, locationId);
    }

    /**
     * Bulk update vendors
     * PATCH /vendor/bulk
     */
    @Patch('bulk')
    @ApiOperation({ summary: 'Bulk update vendors', description: 'Update multiple vendors at once' })
    @ApiBody({
        description: 'Array of vendor updates',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Vendor ID' },
                    data: { type: 'object', description: 'Update data for the vendor' }
                }
            },
            example: [
                { id: 'vendor_id_1', data: { isActive: false, description: 'Updated description' } },
                { id: 'vendor_id_2', data: { isActive: true, searchKeywords: ['hotel', 'luxury'] } }
            ]
        }
    })
    @ApiResponse({ status: 200, description: 'Vendors updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid update data' })
    async bulkUpdate(
        @Body() updates: Array<{ id: string; data: UpdateVendorDto }>
    ): Promise<Vendor[]> {
        return this.vendorService.bulkUpdate(updates);
    }
}
