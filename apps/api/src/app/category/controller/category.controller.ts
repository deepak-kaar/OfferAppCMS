import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
    ApiConsumes,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CategoryService } from '../services/category.service';
import {
    CreateCategoryDto,
    UpdateCategoryDto,
} from '../dto/category.dto';
import { Category } from '../../../shared/interface/category';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    /**
     * Create a new category
     * POST /category
     */
    @Post()
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new category',
        description: 'Creates a new category with the provided details. Requires an admin JWT (role: admin).',
    })
    @ApiResponse({ status: 201, description: 'Category successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid category data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Category data with optional icon and image file uploads',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Home' },
                name_ar: { type: 'string', example: 'أجهزة منزلية وتصميم' },
                icon: {
                    type: 'string',
                    format: 'binary',
                    description: 'Icon image file to upload',
                },
                image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Category image file to upload',
                },
                order: { type: 'number', example: 12 },
            },
            required: ['name', 'name_ar'],
        },
    })
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'icon', maxCount: 1 },
            { name: 'image', maxCount: 1 },
        ], {
            storage: memoryStorage(),
        }),
    )
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @UploadedFiles() files: { icon?: any[]; image?: any[] },
        @Req() req: any,
    ): Promise<Category> {
        const createdBy = {
            networkId: req.user?.networkId || 'unknown',
            name: req.user?.name || 'unknown',
        };

        const iconFile = files?.icon?.[0];
        const imageFile = files?.image?.[0];

        return this.categoryService.create(createCategoryDto, createdBy, iconFile, imageFile);
    }

    /**
     * Get all categories
     * GET /category
     */
    @Get()
    @ApiOperation({ summary: 'Get all categories', description: 'Retrieve all categories sorted by order' })
    @ApiResponse({ status: 200, description: 'List of categories retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findAll(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    /**
     * Get a single category by ID
     * GET /category/:id
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID', description: 'Retrieve a single category by its ID' })
    @ApiParam({ name: 'id', description: 'Category ID', type: String })
    @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async findOne(@Param('id') id: string): Promise<Category> {
        return this.categoryService.findOne(id);
    }
}
