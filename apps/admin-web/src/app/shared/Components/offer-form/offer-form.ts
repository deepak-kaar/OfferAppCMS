import { Component, EventEmitter, Input, Output, signal, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeUIModules } from '@offer-app/shared';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { createNewOffer, OfferFormModel } from '../../../features/Offers/models/createOffer';
import { Router } from '@angular/router';
import { GetVendorList } from '../../../features/vendors/services/get-vendor-list';
import { VendorDetails } from '../../../features/vendors/models/vendordetails';
import { CategoryDropdownComponent } from '../category-dropdown/category-dropdown';

const MAX_OFFER_IMAGE_MB = 2;

@Component({
  selector: 'app-offer-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PrimeUIModules,
    CategoryDropdownComponent,
  ],
  templateUrl: './offer-form.html',
  styleUrl: './offer-form.css',
})
export class OfferForm implements OnDestroy {

  @Output() submitOfferFormEvent = new EventEmitter<any>();
  @Input() actionType:string = "";
  @Input() buttonName:string = "";
  @Input() editableFormData: OfferFormModel | null = null;
  @Input() backNavRouteLink:string = "";
  @Input() isLoading:boolean = false;
  minDate = new Date();
 offerForm!:FormGroup;
 constructor(private fb: FormBuilder,private router : Router,private vendorlist :GetVendorList ) {
   this.offerForm = this.fb.group(
{

    selectedVendor: ['', Validators.required],
    titleEn: ['', Validators.required],
    titleAr: [''],
    descriptionEn: [''],
    descriptionAr: [''],
    discountEn: [''],
    discountAr: [''],
    startdate:['',Validators.required],
    expiry: ['', Validators.required],
    category: this.fb.control([], {
  nonNullable: true,
  validators: [Validators.required]
}),
    tagInput:[''],
    selectedTags:this.fb.array<FormControl>([]),
    instructionsEn: [''],
    instructionsAr: [''],
    offerImage:[null],
    urlLink:[''],
    offerType: this.fb.control<'regular' | 'occasional' | null>(null, {
  validators: [Validators.required]
}),
    mode: ['store' as 'store' | 'online' | 'both'],
    hotelRating: ['rating' as 'Yes' | 'No'],
    phone: [''],
    email: [''],
    landline: [''],
    highlight: [false],
    discountType: this.fb.control<'Fixed' | 'Percentage' | 'Others' | null>(null, {
  validators: [Validators.required]
}),
    highlightImage:[null],
    highlightTitleEn: [''],
    highlightTitleAr: [''],
    highlightDescription: ['']

}



   ) 
 }
  @ViewChild('offerFileInput') offerFileInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('highlightFileInput') highlightFileInputRef?: ElementRef<HTMLInputElement>;

  vendors = signal<VendorDetails[]>([]);
  isDragging = false;
  isDraggingHighlight = false;
  offerImagePreviewUrl = signal<string | null>(null);
  selectedOfferFile = signal<File | null>(null);
  highlightPreviewUrl = signal<string | null>(null);
  selectedHighlightFile = signal<File | null>(null);

ngOnInit() {
  this.loadInitialData();

   if (this.actionType === 'edit' && this.editableFormData && Object.keys(this.editableFormData).length > 0) {
      console.log('Mapping form data in ngOnInit');
      try {
        this.mapOfferToForm(this.editableFormData);
      } catch (error) {
        console.error('Error mapping vendor to form in ngOnInit:', error);
      }
    }
}

loadInitialData() {
  this.getVendorIds();
}

getVendorIds() {
  this.vendorlist.getAllVendors().subscribe({
    next: res => this.vendors.set(res),
    error: err => console.error('Vendor fetch error:', err)
  });
}



 submit() {
  
    if (this.offerForm.invalid) {
      this.markFormGroupTouched(this.offerForm);
      console.log("invalid fields")
      console.log(this.offerForm.value)
      return;
    }
    else{
      console.log(this.offerForm.value)
    const payload = this.mapFormToPayload(this.offerForm.value);
    this.submitOfferFormEvent.emit(payload);
    }
   
  }


   markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }

      if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          ctrl.markAsTouched();
          ctrl.markAsDirty();
        });
      }
    });
  }

mapOfferToForm(offerdetails: any) {

  // Convert Mongo date → JS Date
  const toDate = (d: any) => d?.$date ? new Date(d.$date) : null;

  // Convert "true"/"false" → boolean
  const toBool = (v: any) => v === true || v === "true";

  // Convert API array/string → flat array (no [[]])
  const toFlatArray = (value: any): string[] => {
    if (!value || value === '') return [];
    if (Array.isArray(value)) return value.flat(); // prevents [[]]
    return [value];
  };

  // Reset tags FormArray
  const tagsArray = this.offerForm.get('selectedTags') as FormArray;
  tagsArray.clear();

  const tags = Array.isArray(offerdetails.tags)
    ? offerdetails.tags
    : offerdetails.tags
      ? offerdetails.tags.split(',').map((t: string) => t.trim())
      : [];

  tags.forEach((t: string) => tagsArray.push(new FormControl(t)));

  this.offerForm.patchValue({

    selectedVendor: offerdetails.vendor?._id?.$oid ?? '',

    titleEn: offerdetails.title ?? '',
    titleAr: offerdetails.title_ar ?? '',

    descriptionEn: offerdetails.description ?? '',
    descriptionAr: offerdetails.description_ar ?? '',

    discountEn: offerdetails.discountCode ?? '',
    discountAr: offerdetails.discountCode ?? '',

    startdate: toDate(offerdetails.startDate),
    expiry: toDate(offerdetails.expiryDate),

    category: offerdetails.category?._id?.$oid
      ? [offerdetails.category._id.$oid]
      : [],

    tagInput: '',

    instructionsEn: offerdetails.howToAvail ?? '',
    instructionsAr: offerdetails.howToAvail_ar ?? '',

    offerImage: offerdetails.image ?? null,
    urlLink: offerdetails.discount_url ?? '',

    // Backend: "in store" | "online" | "both"
    // Form: "regular" | "occasional"
    offerType : offerdetails.offerType ? offerdetails.offerType : null,

    mode:
      offerdetails.offerType === 'in store'
        ? 'store'
        : offerdetails.offerType === 'online'
          ? 'online'
          : 'both',

    hotelRating: toBool(offerdetails.hotelStarRating) ? 'Yes' : 'No',

    // FIXED: no more nested arrays
    phone: offerdetails.mobile[0],
    email: offerdetails.email[0],
    landline: offerdetails.telephone[0],

    highlight: toBool(offerdetails.isFeatured),

    discountType:
      offerdetails.discountType === 'fixed'
        ? 'Fixed'
        : offerdetails.discountType === 'percentage'
          ? 'Percentage'
          : 'Others',

    highlightImage: offerdetails.featuredImage ?? null,
    highlightTitleEn: offerdetails.highlights ?? '',
    highlightTitleAr: offerdetails.highlights_ar ?? '',
    highlightDescription: offerdetails.highlights ?? ''
  });
}
  
  backNavigation(){
      this.router.navigate([this.backNavRouteLink])
  }
addTag(){
     const value = this.offerForm.get('tagInput')?.value;
    if (!value) return;
    this.selectedTags.push(new FormControl(value));
    this.offerForm.get('tagInput')?.reset();
}

get selectedTags() {
  return this.offerForm.get('selectedTags') as FormArray;
}

get category() {
  return this.offerForm.get('category') as FormControl;
}
back(){
     this.router.navigate(['/offers']);
}

  onOfferDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onOfferDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onOfferDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files?.length) this.handleOfferFile(files[0]);
  }

  onOfferFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleOfferFile(file);
  }

  handleOfferFile(file: File) {
    if (file.size > MAX_OFFER_IMAGE_MB * 1024 * 1024) return;
    const old = this.offerImagePreviewUrl();
    if (old) URL.revokeObjectURL(old);
    this.offerImagePreviewUrl.set(URL.createObjectURL(file));
    this.selectedOfferFile.set(file);
    this.offerForm.patchValue({ offerImage: file });
    this.offerForm.get('offerImage')?.updateValueAndValidity();
  }

  removeOfferImage() {
    const url = this.offerImagePreviewUrl();
    if (url) URL.revokeObjectURL(url);
    this.offerImagePreviewUrl.set(null);
    this.selectedOfferFile.set(null);
    this.offerForm.patchValue({ offerImage: null });
    this.offerForm.get('offerImage')?.updateValueAndValidity();
    if (this.offerFileInputRef?.nativeElement) this.offerFileInputRef.nativeElement.value = '';
  }

  onHighlightDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingHighlight = true;
  }

  onHighlightDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDraggingHighlight = false;
  }

  onHighlightDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggingHighlight = false;
    const files = event.dataTransfer?.files;
    if (files?.length) this.handleHighlightFile(files[0]);
  }

  onHighlightFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleHighlightFile(file);
  }

  handleHighlightFile(file: File) {
    const old = this.highlightPreviewUrl();
    if (old) URL.revokeObjectURL(old);
    this.highlightPreviewUrl.set(URL.createObjectURL(file));
    this.selectedHighlightFile.set(file);
    this.offerForm.patchValue({ highlightImage: file });
  }

  removeHighlightImage() {
    const url = this.highlightPreviewUrl();
    if (url) URL.revokeObjectURL(url);
    this.highlightPreviewUrl.set(null);
    this.selectedHighlightFile.set(null);
    this.offerForm.patchValue({ highlightImage: null });
    if (this.highlightFileInputRef?.nativeElement) this.highlightFileInputRef.nativeElement.value = '';
  }

  ngOnDestroy() {
    const u = this.offerImagePreviewUrl();
    if (u) URL.revokeObjectURL(u);
    const h = this.highlightPreviewUrl();
    if (h) URL.revokeObjectURL(h);
  }


mapFormToPayload(form: any): createNewOffer {
  return {
    vendorId: form.selectedVendor,

    // categoryId is optional, but your form has an array
    // If backend expects ONE category, pick the first
    categoryId: form.category?.[0] ?? undefined,

    title: form.titleEn,
    title_ar: form.titleAr,

    description: form.descriptionEn,
    description_ar: form.descriptionAr,

    highlights: form.highlightDescription || '',
    highlights_ar: '',

    howToAvail: form.instructionsEn,
    howToAvail_ar: form.instructionsAr,

    discountType: form.discountType.toLowerCase(), // Percentage → percentage

    discountCode: form.discountEn || '',
    discount_url: form.urlLink || '',

    offerType: form.offerType === 'store' ? 'in store' : form.offerType,

    startDate: form.startdate,
    expiryDate: form.expiry,

    locations: [],

    isActive: true,
    isFeatured: form.highlight,
    isOccasional: form.offerType === 'occasional',
    isPartnerHotel: false,

    hotelStarRating: form.hotelRating === 'Yes',
    hotelAmenitites: [],

    rooms: null,

    currency: '',
    currency_ar: null,

    taxValue: '',
    taxValue_ar: '',

    website: form.urlLink || '',

    email: form.email ? [form.email] : [],
    mobile: form.phone ? [form.phone] : [],
    telephone: form.landline ? [form.landline] : [],
    contacts: [],

    enableMapSearch: true,

    searchKeywords: [],
    tags: form.selectedTags || [],

    createdByRole: 'Personnel',

    image: form.offerImage,
    featuredImage: form.highlightImage
  };
}



}
