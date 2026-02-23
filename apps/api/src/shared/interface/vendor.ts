export interface FirestoreId {
  $oid: string;
}

export interface FireStoreDate {
  $date: string;
}

export interface CreatedBy {
  networkId: string;
  name: string;
}

export interface VendorLocation {
  __id__: FirestoreId;
  branch_name: string;
  branch_name_ar: string;
  city: string;
  link: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  createdAt: FireStoreDate;
  updatedAt: FireStoreDate;
  __v: number;
}

export interface Vendor {
  _id: FirestoreId;
  __v: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  logo: string;
  website: string[];
  crn_no: string;
  email: string[];
  mobile: string[];
  telephone: string[];
  links: string[];
  locations: VendorLocation[];
  categories?: string[];
  offers: string[];
  searchKeywords: string[];
  smeName: string;
  smeEmail: string;
  smePhone: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdBy: CreatedBy;
  createdAt: FireStoreDate;
  updatedAt: FireStoreDate;
}
