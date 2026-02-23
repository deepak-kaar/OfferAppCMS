import { VendorLocation } from '../../../shared/interface/vendor';
export declare class CreateVendorDto {
    name: string;
    name_ar?: string;
    description?: string;
    description_ar?: string;
    website?: string[];
    crn_no: string;
    email?: string[];
    mobile?: string[];
    telephone?: string[];
    links?: string[];
    locations?: Omit<VendorLocation, '__id__' | 'createdAt' | 'updatedAt' | '__v'>[];
    searchKeywords?: string[];
    smeName?: string;
    smeEmail?: string;
    smePhone?: string;
    isActive?: boolean;
}
export declare class UpdateVendorDto {
    name?: string;
    name_ar?: string;
    description?: string;
    description_ar?: string;
    logo?: string;
    website?: string[];
    crn_no?: string;
    email?: string[];
    mobile?: string[];
    telephone?: string[];
    links?: string[];
    locations?: VendorLocation[];
    offers?: string[];
    searchKeywords?: string[];
    smeName?: string;
    smeEmail?: string;
    smePhone?: string;
    isActive?: boolean;
}
export declare class CreateVendorLocationDto {
    city: string;
    city_ar: string;
    country: string;
    country_ar: string;
    latitude?: number | null;
    longitude?: number | null;
}
export declare class VendorFilterDto {
    isActive?: boolean;
    country?: string;
    searchKeyword?: string;
}
export declare class VendorSearchDto {
    searchTerm: string;
}
