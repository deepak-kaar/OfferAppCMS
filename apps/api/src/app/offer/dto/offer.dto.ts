import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType, OfferType } from '../../../shared/interface/offer';

export class CreateOfferDto {
  @ApiProperty({ description: 'Vendor ID to associate this offer with', example: 'vendor_id_123' })
  vendorId: string;

  @ApiPropertyOptional({ description: 'Category ID for this offer', example: 'category_id_123' })
  categoryId?: string;

  @ApiProperty({ description: 'Offer title in English', example: '25% Discount' })
  title: string;

  @ApiPropertyOptional({ description: 'Offer title in Arabic', example: 'خصم 25%' })
  title_ar?: string;

  @ApiProperty({ description: 'Offer description in English', example: 'On Spare Parts' })
  description: string;

  @ApiPropertyOptional({ description: 'Offer description in Arabic', example: 'على قطع الغيار' })
  description_ar?: string;

  @ApiPropertyOptional({ description: 'Offer highlights/terms in English' })
  highlights?: string;

  @ApiPropertyOptional({ description: 'Offer highlights/terms in Arabic' })
  highlights_ar?: string;

  @ApiProperty({ description: 'How to avail the offer in English', example: 'Present your Saudi Aramco ID at the location.' })
  howToAvail: string;

  @ApiPropertyOptional({ description: 'How to avail the offer in Arabic' })
  howToAvail_ar?: string;

  @ApiProperty({
    description: 'Type of discount',
    enum: DiscountType,
    example: DiscountType.PERCENTAGE
  })
  discountType: DiscountType;

  @ApiPropertyOptional({ description: 'Discount code if applicable', example: 'SAVE25' })
  discountCode?: string;

  @ApiPropertyOptional({ description: 'URL for discount/offer details' })
  discount_url?: string;

  @ApiProperty({
    description: 'Where the offer can be used',
    enum: OfferType,
    example: OfferType.IN_STORE
  })
  offerType: OfferType;

  @ApiProperty({ description: 'Offer start date', example: '2023-01-01' })
  startDate: string;

  @ApiProperty({ description: 'Offer expiry date', example: '2023-12-31' })
  expiryDate: string;

  @ApiPropertyOptional({ description: 'Offer image URL' })
  image?: string;

  @ApiPropertyOptional({ description: 'Featured image URL for highlights' })
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'Is the offer active?', example: true, default: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Is this a featured offer?', example: false, default: false })
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Is this an occasional/seasonal offer?', example: false, default: false })
  isOccasional?: boolean;

  @ApiPropertyOptional({ description: 'Is this a partner hotel offer?', example: false, default: false })
  isPartnerHotel?: boolean;

  @ApiPropertyOptional({ description: 'Does hotel have star rating?', example: false, default: false })
  hotelStarRating?: boolean;

  @ApiPropertyOptional({ description: 'Hotel amenities list', type: [String], example: ['WiFi', 'Pool', 'Gym'] })
  hotelAmenitites?: string[];

  @ApiPropertyOptional({ description: 'Number of rooms (for hotel offers)', example: 50, nullable: true })
  rooms?: number | null;

  @ApiPropertyOptional({ description: 'Currency in English', example: 'SAR' })
  currency?: string;

  @ApiPropertyOptional({ description: 'Currency in Arabic', example: 'ريال سعودي', nullable: true })
  currency_ar?: string | null;

  @ApiPropertyOptional({ description: 'Tax value information' })
  taxValue?: string;

  @ApiPropertyOptional({ description: 'Tax value in Arabic' })
  taxValue_ar?: string;

  @ApiPropertyOptional({ description: 'Offer website URL' })
  website?: string;

  @ApiPropertyOptional({ description: 'Contact email addresses', type: [String] })
  email?: string[];

  @ApiPropertyOptional({ description: 'Contact mobile numbers', type: [String] })
  mobile?: string[];

  @ApiPropertyOptional({ description: 'Contact telephone numbers', type: [String] })
  telephone?: string[];

  @ApiPropertyOptional({ description: 'Other contact information', type: [String] })
  contacts?: string[];

  @ApiPropertyOptional({ description: 'Enable map search for this offer?', example: true, default: true })
  enableMapSearch?: boolean;

  @ApiPropertyOptional({ description: 'Search keywords', type: [String], example: ['automotive', 'discount', 'parts'] })
  searchKeywords?: string[];

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String], example: ['cars', 'service'] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Role of the user creating the offer', example: 'Personnel' })
  createdByRole?: string;
}

export class UpdateOfferDto {
  @ApiPropertyOptional({ description: 'Vendor ID to associate this offer with', example: 'vendor_id_123' })
  vendorId?: string;

  @ApiPropertyOptional({ description: 'Category ID for this offer', example: 'category_id_123' })
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Offer title in English', example: '30% Discount' })
  title?: string;

  @ApiPropertyOptional({ description: 'Offer title in Arabic', example: 'خصم 30%' })
  title_ar?: string;

  @ApiPropertyOptional({ description: 'Offer description in English' })
  description?: string;

  @ApiPropertyOptional({ description: 'Offer description in Arabic' })
  description_ar?: string;

  @ApiPropertyOptional({ description: 'Offer highlights/terms in English' })
  highlights?: string;

  @ApiPropertyOptional({ description: 'Offer highlights/terms in Arabic' })
  highlights_ar?: string;

  @ApiPropertyOptional({ description: 'How to avail the offer in English' })
  howToAvail?: string;

  @ApiPropertyOptional({ description: 'How to avail the offer in Arabic' })
  howToAvail_ar?: string;

  @ApiPropertyOptional({
    description: 'Type of discount',
    enum: DiscountType
  })
  discountType?: DiscountType;

  @ApiPropertyOptional({ description: 'Discount code if applicable' })
  discountCode?: string;

  @ApiPropertyOptional({ description: 'URL for discount/offer details' })
  discount_url?: string;

  @ApiPropertyOptional({
    description: 'Where the offer can be used',
    enum: OfferType
  })
  offerType?: OfferType;

  @ApiPropertyOptional({ description: 'Offer start date', example: '2023-01-01' })
  startDate?: string;

  @ApiPropertyOptional({ description: 'Offer expiry date', example: '2023-12-31' })
  expiryDate?: string;

  @ApiPropertyOptional({ description: 'Offer image URL' })
  image?: string;

  @ApiPropertyOptional({ description: 'Featured image URL for highlights' })
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'Is the offer active?', example: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Is this a featured offer?', example: false })
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Is this an occasional/seasonal offer?', example: false })
  isOccasional?: boolean;

  @ApiPropertyOptional({ description: 'Is this a partner hotel offer?', example: false })
  isPartnerHotel?: boolean;

  @ApiPropertyOptional({ description: 'Does hotel have star rating?', example: false })
  hotelStarRating?: boolean;

  @ApiPropertyOptional({ description: 'Hotel amenities list', type: [String] })
  hotelAmenitites?: string[];

  @ApiPropertyOptional({ description: 'Number of rooms (for hotel offers)', nullable: true })
  rooms?: number | null;

  @ApiPropertyOptional({ description: 'Currency in English' })
  currency?: string;

  @ApiPropertyOptional({ description: 'Currency in Arabic', nullable: true })
  currency_ar?: string | null;

  @ApiPropertyOptional({ description: 'Tax value information' })
  taxValue?: string;

  @ApiPropertyOptional({ description: 'Tax value in Arabic' })
  taxValue_ar?: string;

  @ApiPropertyOptional({ description: 'Offer website URL' })
  website?: string;

  @ApiPropertyOptional({ description: 'Contact email addresses', type: [String] })
  email?: string[];

  @ApiPropertyOptional({ description: 'Contact mobile numbers', type: [String] })
  mobile?: string[];

  @ApiPropertyOptional({ description: 'Contact telephone numbers', type: [String] })
  telephone?: string[];

  @ApiPropertyOptional({ description: 'Other contact information', type: [String] })
  contacts?: string[];

  @ApiPropertyOptional({ description: 'Enable map search for this offer?', example: true })
  enableMapSearch?: boolean;

  @ApiPropertyOptional({ description: 'Search keywords', type: [String] })
  searchKeywords?: string[];

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Role of the user creating the offer' })
  createdByRole?: string;
}

export class OfferFilterDto {
  @ApiPropertyOptional({ description: 'Filter by active status', example: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by featured status', example: true })
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Filter by vendor ID', example: 'vendor_id_123' })
  vendorId?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID', example: 'category_id_123' })
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by country', example: 'Saudi Arabia' })
  country?: string;

  @ApiPropertyOptional({ description: 'Filter by city', example: 'Dammam' })
  city?: string;

  @ApiPropertyOptional({ description: 'Filter by discount type', enum: DiscountType })
  discountType?: DiscountType;

  @ApiPropertyOptional({ description: 'Filter by offer type', enum: OfferType })
  offerType?: OfferType;

  @ApiPropertyOptional({ description: 'Filter by tag', example: 'automotive' })
  tag?: string;
}

export class OfferSearchDto {
  @ApiProperty({ description: 'Search term to find offers', example: 'discount' })
  searchTerm: string;
}
