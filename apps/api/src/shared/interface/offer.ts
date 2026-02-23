import { FirestoreId, FireStoreDate } from './vendor';

export interface OfferLocation {
  _id: FirestoreId;
  city: string;
  city_ar: string;
  country: string;
  country_ar: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: FireStoreDate;
  updatedAt: FireStoreDate;
  __v: number;
}

export interface OfferCategory {
  _id: FirestoreId;
  icon: string;
  image: string;
  name: string;
  name_ar: string;
  order: number;
  createdAt: FireStoreDate;
  updatedAt: FireStoreDate;
}

/** Stored with each offer: only vendor id, name, email, and mobile. */
export interface OfferVendor {
  _id: FirestoreId;
  name: string;
  email: string[];
  mobile: string[];
}

export enum DiscountType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  BOTH = 'both',
}

export enum OfferType {
  IN_STORE = 'in store',
  ONLINE = 'online',
  BOTH = 'both',
}

export interface Offer {
  _id: FirestoreId;
  __v: number;
  vendor: OfferVendor;
  category: OfferCategory;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  highlights: string;
  highlights_ar: string;
  howToAvail: string;
  howToAvail_ar: string;
  discountType: DiscountType;
  discountCode: string;
  discount_url: string;
  offerType: OfferType;
  startDate: FireStoreDate;
  expiryDate: FireStoreDate;
  image: string;
  featuredImage: string;
  isActive: boolean;
  isFeatured: boolean;
  isOccasional: boolean;
  isPartnerHotel: boolean;
  hotelStarRating: boolean;
  hotelAmenitites: string[];
  rooms: number | null;
  currency: string;
  currency_ar: string | null;
  taxValue: string;
  taxValue_ar: string;
  website: string;
  email: string[];
  mobile: string[];
  telephone: string[];
  contacts: string[];
  enableMapSearch: boolean;
  searchKeywords: string[];
  tags: string[];
  createdByRole: string;
  createdAt: FireStoreDate;
  updatedAt: FireStoreDate;
}
