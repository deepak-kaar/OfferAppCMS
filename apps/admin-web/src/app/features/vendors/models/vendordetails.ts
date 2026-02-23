/** Ensure links is always string[] when receiving vendor data from API. */
export function normalizeVendorLinks(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'string' ? item.trim() : String(item).trim())).filter((s) => s.length > 0);
  }
  if (typeof value === 'string') {
    if (value.trim() === '') return [];
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return normalizeVendorLinks(parsed);
    } catch {
      // not JSON
    }
    return value.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
  }
  return [];
}

/** Apply to a vendor object so links is string[]. */
export function normalizeVendorResponse<T extends { links?: unknown }>(v: T): T {
  if (!v) return v;
  return { ...v, links: normalizeVendorLinks(v.links) } as T;
}

export interface VendorDetails {
  _id: MongoId;
  crn_no: string;
  mobile: string | string[];
  smePhone: string;
  telephone: string | string[];
  name_ar: string;
  name: string;
  isActive: boolean | string;
  smeEmail: string;
  searchKeywords: string[] | string;
  description_ar: string;
  smeName: string;
  links: string[];
  website: string | string[];
  email: string | string[];
  description: string;
  locations: Location[] | string; 
  logo?: string;
  offers: any[];
  createdBy: CreatedBy;
  createdAt: DateValue;
  updatedAt: DateValue;
  __v: number;
}

export interface MongoId {
  $oid: string;
}

export interface DateValue {
  $date: string;
}

export interface CreatedBy {
  networkId: string;
  name: string;
}

export interface Location {
  // Add fields when you know the structure
  [key: string]: any;
}