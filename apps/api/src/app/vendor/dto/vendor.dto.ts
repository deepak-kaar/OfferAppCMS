import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VendorLocation } from '../../../shared/interface/vendor';

export class CreateVendorDto {
  @ApiProperty({ description: 'Vendor name in English', example: 'Vida Hotel' })
  name: string;

  @ApiPropertyOptional({ description: 'Vendor name in Arabic', example: 'فندق فيدا' })
  name_ar?: string;

  @ApiPropertyOptional({ description: 'Vendor description in English', example: 'Luxury hotel in downtown' })
  description?: string;

  @ApiPropertyOptional({ description: 'Vendor description in Arabic', example: 'فندق فاخر في وسط المدينة' })
  description_ar?: string;

  @ApiPropertyOptional({ description: 'Vendor website URLs', type: [String], example: ['https://vidahotels.com'] })
  website?: string[];

  @ApiProperty({ description: 'Commercial Registration Number', example: 'CRN123456' })
  crn_no: string;

  @ApiPropertyOptional({ description: 'Email addresses', type: [String], example: ['info@vidahotels.com'] })
  email?: string[];

  @ApiPropertyOptional({ description: 'Mobile numbers', type: [String], example: ['+97312345678'] })
  mobile?: string[];

  @ApiPropertyOptional({ description: 'Telephone numbers', type: [String], example: ['+97317654321'] })
  telephone?: string[];

  @ApiPropertyOptional({ description: 'Social media and other links', type: [String], example: ['https://instagram.com/vidahotels'] })
  links?: string[];

  @ApiPropertyOptional({ description: 'Vendor locations (stored in subcollection)', type: 'array', items: { type: 'object' } })
  locations?: CreateVendorLocationDto[];

  @ApiPropertyOptional({ description: 'Category IDs (array of category IDs)', type: [String], example: ['61d2d9d51924c27a9ed5128b', '61d2d9d51924c27a9ed5128c'] })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Search keywords for vendor discovery', type: [String], example: ['hotel', 'luxury', 'accommodation'] })
  searchKeywords?: string[];

  @ApiPropertyOptional({ description: 'SME contact person name', example: 'John Doe' })
  smeName?: string;

  @ApiPropertyOptional({ description: 'SME contact email', example: 'john.doe@vidahotels.com' })
  smeEmail?: string;

  @ApiPropertyOptional({ description: 'SME contact phone', example: '+97312345678' })
  smePhone?: string;
}

export class UpdateVendorDto {
  @ApiPropertyOptional({ description: 'Vendor name in English', example: 'Vida Hotel & Resort' })
  name?: string;

  @ApiPropertyOptional({ description: 'Vendor name in Arabic', example: 'فندق فيدا' })
  name_ar?: string;

  @ApiPropertyOptional({ description: 'Vendor description in English', example: 'Luxury hotel and resort in downtown' })
  description?: string;

  @ApiPropertyOptional({ description: 'Vendor description in Arabic', example: 'فندق فاخر في وسط المدينة' })
  description_ar?: string;

  @ApiPropertyOptional({ description: 'Vendor logo URL', example: 'https://example.com/logo.png' })
  logo?: string;

  @ApiPropertyOptional({ description: 'Vendor website URLs', type: [String], example: ['https://vidahotelsandresorts.com'] })
  website?: string[];

  @ApiPropertyOptional({ description: 'Commercial Registration Number', example: 'CRN123456' })
  crn_no?: string;

  @ApiPropertyOptional({ description: 'Email addresses', type: [String], example: ['info@vidahotels.com'] })
  email?: string[];

  @ApiPropertyOptional({ description: 'Mobile numbers', type: [String], example: ['+97312345678'] })
  mobile?: string[];

  @ApiPropertyOptional({ description: 'Telephone numbers', type: [String], example: ['+97317654321'] })
  telephone?: string[];

  @ApiPropertyOptional({ description: 'Social media and other links', type: [String], example: ['https://instagram.com/vidahotels'] })
  links?: string[];

  @ApiPropertyOptional({ description: 'Vendor locations', type: 'array', items: { type: 'object' } })
  locations?: VendorLocation[];

  @ApiPropertyOptional({ description: 'Category IDs (array of category IDs)', type: [String], example: ['61d2d9d51924c27a9ed5128b', '61d2d9d51924c27a9ed5128c'] })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Associated offer IDs', type: [String], example: ['offer123', 'offer456'] })
  offers?: string[];

  @ApiPropertyOptional({ description: 'Search keywords', type: [String], example: ['hotel', 'luxury', 'accommodation'] })
  searchKeywords?: string[];

  @ApiPropertyOptional({ description: 'SME contact person name', example: 'John Doe' })
  smeName?: string;

  @ApiPropertyOptional({ description: 'SME contact email', example: 'john.doe@vidahotels.com' })
  smeEmail?: string;

  @ApiPropertyOptional({ description: 'SME contact phone', example: '+97312345678' })
  smePhone?: string;

  @ApiPropertyOptional({ description: 'Vendor active status', example: true })
  isActive?: boolean;
}

export class CreateVendorLocationDto {
  @ApiProperty({ description: 'Branch name in English', example: 'Main Branch' })
  branch_name: string;

  @ApiPropertyOptional({ description: 'Branch name in Arabic', example: 'الفرع الرئيسي' })
  branch_name_ar?: string;

  @ApiProperty({ description: 'City', example: 'Manama' })
  city: string;

  @ApiPropertyOptional({ description: 'Map or info link', example: 'https://maps.google.com/...' })
  link?: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate', example: 26.2285, nullable: true })
  latitude?: number | null;

  @ApiPropertyOptional({ description: 'Longitude coordinate', example: 50.5860, nullable: true })
  longitude?: number | null;

  @ApiPropertyOptional({ description: 'Address', example: '123 Main Street' })
  address?: string;
}

export class VendorFilterDto {
  @ApiPropertyOptional({ description: 'Filter by active status', example: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by country', example: 'Bahrain' })
  country?: string;

  @ApiPropertyOptional({ description: 'Filter by search keyword', example: 'hotel' })
  searchKeyword?: string;
}

export class VendorSearchDto {
  @ApiProperty({ description: 'Search term to find vendors', example: 'vida' })
  searchTerm: string;
}
