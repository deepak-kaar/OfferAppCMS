export interface CreateVendor {
  name: string;                     // required
  name_ar?: string;                 // optional
  description?: string;             // optional
  description_ar?: string;          // optional

  website?: string[];               // array<string>
  crn_no: string;                   // required

  email?: string[];                 // array<string>
  mobile?: string[];                // array<string>
  telephone?: string[];             // array<string>
  links?: string[];                 // array<string>

  locations?: VendorLocation[];     // array<object>

  categories?: string[];            // array of category IDs

  searchKeywords?: string[];        // array<string>

  smeName?: string;
  smeEmail?: string;
  smePhone?: string;

  isActive: boolean;                // required

  logo?: File | null;               // binary file upload
}

export interface VendorLocation {
  [key: string]: any;   // allows any object structure
}