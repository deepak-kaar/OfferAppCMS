import {
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
    UseInterceptors,
    UploadedFiles,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { OfferService } from '../services/offer.service';
import {
    CreateOfferDto,
    UpdateOfferDto,
    OfferFilterDto,
} from '../dto/offer.dto';
import { Offer } from '../../../shared/interface/offer';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@ApiTags('offer')
@Controller('offer')
export class OfferController {
    constructor(private readonly offerService: OfferService) {}

    /**
     * Create a new offer
     * POST /offer
     */
    @Post()
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new offer',
        description: 'Creates a new offer for a specific vendor. Requires an admin JWT (role: admin).',
    })
    @ApiResponse({ status: 201, description: 'Offer successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid offer data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Offer data with optional image and featured image file uploads',
        schema: {
            type: 'object',
            properties: {
                vendorId: { type: 'string', example: 'vendor_id_123' },
                categoryId: { type: 'string', example: 'category_id_123' },
                title: { type: 'string', example: '25% Discount' },
                title_ar: { type: 'string', example: 'خصم 25%' },
                description: { type: 'string', example: 'On Spare Parts' },
                description_ar: { type: 'string', example: 'على قطع الغيار' },
                highlights: { type: 'string' },
                highlights_ar: { type: 'string' },
                howToAvail: { type: 'string', example: 'Present your ID at the location' },
                howToAvail_ar: { type: 'string' },
                discountType: { type: 'string', enum: ['fixed', 'percentage', 'both'] },
                discountCode: { type: 'string' },
                discount_url: { type: 'string' },
                offerType: { type: 'string', enum: ['in store', 'online', 'both'] },
                startDate: { type: 'string', format: 'date', example: '2023-01-01' },
                expiryDate: { type: 'string', format: 'date', example: '2023-12-31' },
                locations: { type: 'array', items: { type: 'object' } },
                isActive: { type: 'boolean', default: true },
                isFeatured: { type: 'boolean', default: false },
                isOccasional: { type: 'boolean', default: false },
                isPartnerHotel: { type: 'boolean', default: false },
                hotelStarRating: { type: 'boolean', default: false },
                hotelAmenitites: { type: 'array', items: { type: 'string' } },
                rooms: { type: 'number', nullable: true },
                currency: { type: 'string' },
                currency_ar: { type: 'string', nullable: true },
                taxValue: { type: 'string' },
                taxValue_ar: { type: 'string' },
                website: { type: 'string' },
                email: { type: 'array', items: { type: 'string' } },
                mobile: { type: 'array', items: { type: 'string' } },
                telephone: { type: 'array', items: { type: 'string' } },
                contacts: { type: 'array', items: { type: 'string' } },
                enableMapSearch: { type: 'boolean', default: true },
                searchKeywords: { type: 'array', items: { type: 'string' } },
                tags: { type: 'array', items: { type: 'string' } },
                createdByRole: { type: 'string', example: 'Personnel' },
                image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Offer image file to upload',
                },
                featuredImage: {
                    type: 'string',
                    format: 'binary',
                    description: 'Featured image file to upload',
                },
            },
            required: ['vendorId', 'title', 'description', 'howToAvail', 'discountType', 'offerType', 'startDate', 'expiryDate'],
        },
    })
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 1 },
                { name: 'featuredImage', maxCount: 1 },
            ],
            {
                storage: memoryStorage(),
            },
        ),
    )
    async create(
        @UploadedFiles() files: { image?: any[]; featuredImage?: any[] },
        @Body() createOfferDto: CreateOfferDto,
    ): Promise<Offer> {
        const image = files?.image?.[0];
        const featuredImage = files?.featuredImage?.[0];
        return this.offerService.create(createOfferDto, image, featuredImage);
    }

    /**
     * Get all offers with optional filters
     * GET /offer?isActive=true&isFeatured=true&vendorId=xyz
     */
    @Get()
    @ApiOperation({ summary: 'Get all offers', description: 'Retrieve all offers with optional filters' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
    @ApiQuery({ name: 'isFeatured', required: false, type: Boolean, description: 'Filter by featured status' })
    @ApiQuery({ name: 'vendorId', required: false, type: String, description: 'Filter by vendor ID' })
    @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category ID' })
    @ApiQuery({ name: 'country', required: false, type: String, description: 'Filter by country name' })
    @ApiQuery({ name: 'city', required: false, type: String, description: 'Filter by city name' })
    @ApiQuery({ name: 'discountType', required: false, enum: ['fixed', 'percentage', 'both'], description: 'Filter by discount type' })
    @ApiQuery({ name: 'offerType', required: false, enum: ['in store', 'online', 'both'], description: 'Filter by offer type' })
    @ApiQuery({ name: 'tag', required: false, type: String, description: 'Filter by tag' })
    @ApiResponse({ status: 200, description: 'List of offers retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findAll(@Query() filters: OfferFilterDto): Promise<Offer[]> {
        return this.offerService.findAll(filters);
    }

    /**
     * Search offers by title, description, or keyword
     * GET /offer/search?searchTerm=discount
     */
    @Get('search')
    @ApiOperation({ summary: 'Search offers', description: 'Search offers by title, description, keywords, or tags' })
    @ApiQuery({ name: 'searchTerm', required: true, type: String, description: 'Search term for offer search' })
    @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async search(@Query('searchTerm') searchTerm: string): Promise<Offer[]> {
        return this.offerService.search(searchTerm);
    }

    /**
     * Get offers by vendor ID
     * GET /offer/vendor/:vendorId
     */
    @Get('vendor/:vendorId')
    @ApiOperation({ summary: 'Get offers by vendor', description: 'Retrieve all offers for a specific vendor' })
    @ApiParam({ name: 'vendorId', description: 'The ID of the vendor', type: String })
    @ApiResponse({ status: 200, description: 'Offers for the specified vendor retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findByVendor(@Param('vendorId') vendorId: string): Promise<Offer[]> {
        return this.offerService.findByVendor(vendorId);
    }

    /**
     * Get offers by category ID
     * GET /offer/category/:categoryId
     */
    @Get('category/:categoryId')
    @ApiOperation({ summary: 'Get offers by category', description: 'Retrieve all offers in a specific category' })
    @ApiParam({ name: 'categoryId', description: 'The ID of the category', type: String })
    @ApiResponse({ status: 200, description: 'Offers for the specified category retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findByCategory(@Param('categoryId') categoryId: string): Promise<Offer[]> {
        return this.offerService.findByCategory(categoryId);
    }

    /**
     * Get a single offer by ID
     * GET /offer/:id
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get offer by ID', description: 'Retrieve a single offer by its ID' })
    @ApiParam({ name: 'id', description: 'Offer ID', type: String })
    @ApiResponse({ status: 200, description: 'Offer retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Offer not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findOne(@Param('id') id: string): Promise<Offer> {
        return this.offerService.findOne(id);
    }

    /**
     * Update an offer
     * PUT /offer/:id
     */
    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Update offer', description: 'Update an existing offer by ID. Requires admin JWT.' })
    @ApiParam({ name: 'id', description: 'Offer ID', type: String })
    @ApiResponse({ status: 200, description: 'Offer updated successfully' })
    @ApiResponse({ status: 404, description: 'Offer not found' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid update data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    async update(
        @Param('id') id: string,
        @Body() updateOfferDto: UpdateOfferDto
    ): Promise<Offer> {
        return this.offerService.update(id, updateOfferDto);
    }

    /**
     * Delete an offer (hard delete)
     * DELETE /offer/:id
     */
    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete offer', description: 'Permanently delete an offer by ID (hard delete). Requires admin JWT.' })
    @ApiParam({ name: 'id', description: 'Offer ID', type: String })
    @ApiResponse({ status: 200, description: 'Offer deleted successfully' })
    @ApiResponse({ status: 404, description: 'Offer not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    async remove(@Param('id') id: string): Promise<{ message: string; id: string }> {
        return this.offerService.remove(id);
    }

    /**
     * Deactivate an offer (soft delete)
     * PATCH /offer/:id/deactivate
     */
    @Patch(':id/deactivate')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Deactivate offer', description: 'Deactivate an offer (soft delete) by setting isActive to false. Requires admin JWT.' })
    @ApiParam({ name: 'id', description: 'Offer ID', type: String })
    @ApiResponse({ status: 200, description: 'Offer deactivated successfully' })
    @ApiResponse({ status: 404, description: 'Offer not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    async deactivate(@Param('id') id: string): Promise<Offer> {
        return this.offerService.deactivate(id);
    }

    /**
     * Activate an offer
     * PATCH /offer/:id/activate
     */
    @Patch(':id/activate')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Activate offer', description: 'Activate an offer by setting isActive to true. Requires admin JWT.' })
    @ApiParam({ name: 'id', description: 'Offer ID', type: String })
    @ApiResponse({ status: 200, description: 'Offer activated successfully' })
    @ApiResponse({ status: 404, description: 'Offer not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    async activate(@Param('id') id: string): Promise<Offer> {
        return this.offerService.activate(id);
    }

    /**
     * Bulk update offers
     * PATCH /offer/bulk
     */
    @Patch('bulk')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Bulk update offers', description: 'Update multiple offers at once. Requires admin JWT.' })
    @ApiBody({
        description: 'Array of offer updates',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Offer ID' },
                    data: { type: 'object', description: 'Update data for the offer' }
                }
            },
            example: [
                { id: 'offer_id_1', data: { isActive: false, title: 'Updated Offer Title' } },
                { id: 'offer_id_2', data: { isFeatured: true, discountType: 'percentage' } }
            ]
        }
    })
    @ApiResponse({ status: 200, description: 'Offers updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid update data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    async bulkUpdate(
        @Body() updates: Array<{ id: string; data: UpdateOfferDto }>
    ): Promise<Offer[]> {
        return this.offerService.bulkUpdate(updates);
    }
}
