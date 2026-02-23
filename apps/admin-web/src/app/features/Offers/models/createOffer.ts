export interface OfferFormModel {
  vendorId: string;
  titleEn: string;
  titleAr: string;
  discountEn: string;
  discountAr: string;
  expiryDate: string;
  categoryId: string;
  instructionsEn: string;
  instructionsAr: string;
  tags: string[];
  offerType: 'regular' | 'occasional';
  mode: 'store' | 'online' | 'both';
}

export interface createNewOffer {
  vendorId: string;
  categoryId?: string;

  title: string;
  title_ar: string;

  description: string;
  description_ar: string;

  highlights?: string;
  highlights_ar?: string;
  howToAvail: string;
  howToAvail_ar?: string;

  discountType: 'fixed' | 'percentage' | 'both';
  discountCode?: string;
  discount_url?: string;

  offerType: 'in store' | 'online' | 'both';

  startDate: string;   // ISO date
  expiryDate: string;  // ISO date

  locations?: Array<Record<string, any>>;

  isActive: boolean;
  isFeatured: boolean;
  isOccasional: boolean;
  isPartnerHotel: boolean;

  hotelStarRating: boolean;
  hotelAmenitites?: string[];

  rooms?: number | null;

  currency?: string;
  currency_ar?: string | null;

  taxValue?: string;
  taxValue_ar?: string;

  website?: string;

  email?: string[];
  mobile?: string[];
  telephone?: string[];
  contacts?: string[];

  enableMapSearch: boolean;

  searchKeywords?: string[];
  tags?: string[];

  createdByRole?: string;

  image?: File;           // binary upload
  featuredImage?: File;   // binary upload

}


export interface OfferListItem {
  _id: MongoId;
  vendor: VendorInfo;
  category: CategoryInfo | null;

  title: string;
  title_ar: string;

  description: string;
  description_ar: string;

  highlights: string;
  highlights_ar: string;

  howToAvail: string;
  howToAvail_ar: string;

  discountType: 'fixed' | 'percentage' | 'both';
  discountCode: string;
  discount_url: string;

  offerType: 'in store' | 'online' | 'both';

  startDate: MongoDate;
  expiryDate: MongoDate;

  image: string;
  featuredImage: string;

  isActive: boolean | string;
  isFeatured: boolean | string;
  isOccasional: boolean | string;
  isPartnerHotel: boolean | string;

  hotelStarRating: boolean | string;
  hotelAmenitites: string[] | string;

  rooms: number | string | null;

  currency: string;
  currency_ar: string | null;

  taxValue: string;
  taxValue_ar: string;

  website: string | string[];
  email: string | string[];
  mobile: string | string[];
  telephone: string | string[];
  contacts: string | string[];

  enableMapSearch: boolean | string;

  searchKeywords: string[] | string;
  tags: string[] | string;

  createdByRole: string;

  createdAt: MongoDate;
  updatedAt: MongoDate;

  __v: number;
}

export interface MongoId {
  $oid: string;
}

export interface MongoDate {
  $date: string;
}

export interface VendorInfo {
  _id: MongoId;
  name: string;
  logo: Record<string, any>;
  website: string[];
  description: string;
  smeEmail: string;
  smeName: string;
  smePhone: string;
  email: string[];
  mobile: string[];
  telephone: string[];
  locations: VendorLocation[];
  offers: string[];
  searchKeywords: string[];
  isActive: boolean;
  createdAt: MongoDate;
  updatedAt: MongoDate;
  __v: number;
}

export interface VendorLocation {
  branchName: string | null;
  address: string | null;
  googleMapLink: string | null;
}

export interface CategoryInfo {
  _id: MongoId;
  icon: string;
  image: string;
  name: string;
  name_ar: string;
  order: string;
  createdAt: MongoDate;
  updatedAt: MongoDate;
}