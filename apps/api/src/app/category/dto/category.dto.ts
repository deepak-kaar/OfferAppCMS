import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name in English', example: 'Home' })
  name: string;

  @ApiProperty({ description: 'Category name in Arabic', example: 'أجهزة منزلية وتصميم' })
  name_ar: string;

  @ApiPropertyOptional({ description: 'Category icon URL', example: 'https://example.com/icon.png' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Category image URL', example: 'https://example.com/image.png' })
  image?: string;

  @ApiPropertyOptional({ description: 'Display order', example: 12, default: 0 })
  order?: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Category name in English', example: 'Home & Garden' })
  name?: string;

  @ApiPropertyOptional({ description: 'Category name in Arabic', example: 'أجهزة منزلية وتصميم' })
  name_ar?: string;

  @ApiPropertyOptional({ description: 'Category icon URL', example: 'https://example.com/icon.png' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Category image URL', example: 'https://example.com/image.png' })
  image?: string;

  @ApiPropertyOptional({ description: 'Display order', example: 12 })
  order?: number;

  @ApiPropertyOptional({ description: 'Category active status', example: true })
  isActive?: boolean;
}
