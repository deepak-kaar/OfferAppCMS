import { Component, inject, Input, OnDestroy, signal, SimpleChanges, effect, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeUIModules } from '@offer-app/shared';
import { EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateVendor } from '../../../features/vendors/models/createNewVendor';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VendorDetails } from '../../../features/vendors/models/vendordetails';
import { CategoryDropdownComponent } from '../category-dropdown/category-dropdown';
import { MapUrlCoordinatesService } from '../../../features/vendors/services/map-url-coordinates.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vendor-form',
  imports: [ReactiveFormsModule,FormsModule,PrimeUIModules,CategoryDropdownComponent],
  templateUrl: './vendor-form.html',
  styleUrl: './vendor-form.css',
})
export class VendorForm implements OnDestroy {

  @Output() submitFormEvent = new EventEmitter<CreateVendor>();
  @Input() actionType:string = "";
  @Input() buttonName:string = "";
  @Input() editableFormData: VendorDetails | null = null;
  @Input() backNavRouteLink:string = "";
  @Input() isLoading:boolean = false;
  vendorForm!: FormGroup;
  isDragging = false;
  selectedFile = signal<File | null>(null);
  /** Object URL for preview when user uploads a new File (revoked on remove/destroy) */
  logoPreviewUrl = signal<string | null>(null);

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();
  private messageService = inject(MessageService);
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mapUrlCoordinatesService: MapUrlCoordinatesService,
  ) {
       this.vendorForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      crNumber: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      descriptionEn: ['',Validators.required],
      descriptionAr: ['',Validators.required],
      logo: [null],
      linkinput: [''],
      links: this.fb.array<FormControl>([]),

      locations: this.fb.array([
        this.createLocationGroup()
      ]),

      categories: this.fb.control([], {
        nonNullable: true,
      }),

      repFullName: ['', Validators.required],
      repContactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      repEmail: ['', [Validators.required, Validators.email]],
    });

  }

  ngOnInit(): void {
    console.log('VendorForm ngOnInit - actionType:', this.actionType);
    console.log('VendorForm ngOnInit - editableFormData:', this.editableFormData);
    
 
    if (this.actionType === 'edit' && this.editableFormData && Object.keys(this.editableFormData).length > 0) {
      console.log('Mapping form data in ngOnInit');
      try {
        this.mapVendorToForm(this.editableFormData);
      } catch (error) {
        console.error('Error mapping vendor to form in ngOnInit:', error);
      }
    }
  }
 
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges triggered', changes);
    if (changes['editableFormData'] && this.editableFormData) {
      // ignore empty object {}
      if (Object.keys(this.editableFormData).length === 0) {
        console.log('editableFormData is empty, skipping');
        return;
      }

      console.log('Mapping vendor data to form:', this.editableFormData);
      try {
        this.mapVendorToForm(this.editableFormData);
      } catch (error) {
        console.error('Error mapping vendor to form:', error);
      }
    }
  }

  // -----------------------
  // LINKS
  // -----------------------
  get links() {
    return this.vendorForm.get('links') as FormArray;
  }

  // -----------------------
  // CATEGORIES
  // -----------------------
  get categories() {
    return this.vendorForm.get('categories') as FormControl;
  }

  addLink() {
    const value = this.vendorForm.get('linkinput')?.value;
    if (!value) return;
    this.links.push(new FormControl(value));
    this.vendorForm.get('linkinput')?.reset();
  }

  removeLink(index: number) {
    this.links.removeAt(index);
  }

  // -----------------------
  // LOCATIONS
  // -----------------------
  get locations() {
    return this.vendorForm.get('locations') as FormArray;
  }

  createLocationGroup() {
    const locationGroup = this.fb.group({
      branchName: ['', Validators.required],
      branchNameAr: [''],
      city: ['', Validators.required],
      address: ['', Validators.required],
      googleMapLink: [''],
      latitude: [null as number | null],
      longitude: [null as number | null]
    });
    this.setupMapLinkSubscription(locationGroup);
    return locationGroup;
  }

  private setupMapLinkSubscription(locationGroup: FormGroup): void {
    locationGroup.get('googleMapLink')?.valueChanges.pipe(
      debounceTime(500),
      switchMap((url: string | null) => {
        if (!url || !url.trim()) {
          locationGroup.patchValue({ latitude: null, longitude: null }, { emitEvent: false });
          locationGroup.get('googleMapLink')?.setErrors(null);
          return of(null);
        }
        return this.mapUrlCoordinatesService.getCoordinatesFromMapUrl(url).pipe(
          catchError(() => {
            locationGroup.get('googleMapLink')?.setErrors({ invalidMapLink: true });
            locationGroup.patchValue({ latitude: null, longitude: null }, { emitEvent: false });
            return of(null);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(coords => {
      if (coords) {
        locationGroup.patchValue(
          { latitude: coords.latitude, longitude: coords.longitude },
          { emitEvent: false }
        );
        locationGroup.get('googleMapLink')?.setErrors(null);
      }
    });
  }

  addLocation() {
    this.locations.push(this.createLocationGroup());
  }

  removeLocation(index: number) {
    this.locations.removeAt(index);
  }

  // -----------------------
  // FILE UPLOAD
  // -----------------------


onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.handleFile(files[0]);
  }
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.handleFile(file);
  }
}

handleFile(file: File) {
  if (file.size > 10 * 1024 * 1024) {
    this.messageService.add({
      severity: 'error',
      summary: 'File too large',
      detail: 'Maximum allowed size is 10MB'
    });
    return;
  }
  const oldUrl = this.logoPreviewUrl();
  if (oldUrl) {
    URL.revokeObjectURL(oldUrl);
  }
  const previewUrl = URL.createObjectURL(file);
  this.logoPreviewUrl.set(previewUrl);
  this.selectedFile.set(file);
  this.vendorForm.patchValue({ logo: file });
}

  removeLogo(): void {
    const url = this.logoPreviewUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
    this.logoPreviewUrl.set(null);
    this.selectedFile.set(null);
    this.vendorForm.patchValue({ logo: null });
    this.vendorForm.get('logo')?.updateValueAndValidity();
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  
  /** Validation order: first missing in this sequence gets the toast. Paths for form.get(path). */
  private getValidationOrder(): Array<{ path: string; label: string }> {
    const top: Array<{ path: string; label: string }> = [
      { path: 'nameEn', label: 'Vendor Name (English)' },
      { path: 'nameAr', label: 'Vendor Name (Arabic)' },
      { path: 'crNumber', label: 'Commercial Registration Number' },
      { path: 'contact', label: 'Contact Number' },
      { path: 'email', label: 'Email' },
      { path: 'descriptionEn', label: 'Description (English)' },
      { path: 'descriptionAr', label: 'Description (Arabic)' },
    ];
    const locations = this.vendorForm.get('locations') as FormArray;
    const locationEntries: Array<{ path: string; label: string }> = [];
    if (locations) {
      for (let i = 0; i < locations.length; i++) {
        locationEntries.push(
          { path: `locations.${i}.branchName`, label: `Branch Name (Location ${i + 1})` },
          { path: `locations.${i}.city`, label: `City (Location ${i + 1})` }
        );
      }
    }
    const rep: Array<{ path: string; label: string }> = [
      { path: 'repFullName', label: 'Representative Full Name' },
      { path: 'repContactNumber', label: 'Representative Contact Number' },
      { path: 'repEmail', label: 'Representative Email' },
    ];
    return [...top, ...locationEntries, ...rep];
  }

  /** Returns the first invalid field in validation order, or null if valid. */
  private getFirstMissingInOrder(): { control: FormControl; label: string } | null {
    for (const { path, label } of this.getValidationOrder()) {
      const control = this.vendorForm.get(path);
      if (control && control.invalid && control.errors) {
        return { control: control as FormControl, label };
      }
    }
    return null;
  }

  submitForm() {
    if (this.vendorForm.invalid) {
      const first = this.getFirstMissingInOrder();
      if (first) {
        first.control.markAsTouched();
        first.control.markAsDirty();
        this.messageService.add({
          severity: 'warn',
          summary: 'Missing required field',
          detail: `Please fill in: ${first.label}.`,
          life: 5000,
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Missing required fields',
          detail: 'Please fill in all required fields.',
          life: 5000,
        });
        this.markFormGroupTouched(this.vendorForm);
      }
      return;
    }

    const payload = this.mapFormToVendor(this.vendorForm.value);
    this.submitFormEvent.emit(payload);
  }

  mapFormToVendor(form: any): CreateVendor {
    return {
      name: form.nameEn,
      name_ar: form.nameAr,
      description: form.descriptionEn,
      description_ar: form.descriptionAr,

      website: form.links ?? [],
      crn_no: form.crNumber,

      email: form.email ? [form.email] : [],
      mobile: form.contact ? [form.contact] : [],
      telephone: [],

      links: form.links ?? [],

      locations: (form.locations || []).map((loc: any) => ({
        branch_name: loc.branchName || '',
        branch_name_ar: loc.branchNameAr || '',
        city: loc.city || '',
        link: loc.googleMapLink || '',
        latitude: loc.latitude ?? null,
        longitude: loc.longitude ?? null,
        address: loc.address || ''
      })),

      searchKeywords: [],

      smeName: form.repFullName,
      smeEmail: form.repEmail,
      smePhone: form.repContactNumber,

      isActive: true,

      logo: form.logo ?? null,

      categories: Array.isArray(form.categories) ? form.categories : (form.categories ? [form.categories] : [])
    };
  }

  mapVendorToForm(data: any) {
    if (!data || typeof data !== 'object') {
      return;
    }
    console.log('mapVendorToForm called with data:', data);

    // Handle mobile - can be string or string[]
    const mobileValue = Array.isArray(data.mobile) ? data.mobile[0] : (typeof data.mobile === 'string' ? data.mobile : '');

    // Handle email - can be string or string[]
    const emailValue = Array.isArray(data.email) ? data.email[0] : (typeof data.email === 'string' ? data.email : '');

    // Commercial Registration: support both snake_case (API) and camelCase
    const crNumber = data.crn_no ?? data.crnNo ?? '';

    // Logo: may be URL string in edit mode or File when uploading
    const logoValue = data.logo != null ? data.logo : null;
    if (typeof logoValue === 'string') {
      const prev = this.logoPreviewUrl();
      if (prev) URL.revokeObjectURL(prev);
      this.logoPreviewUrl.set(null);
      this.selectedFile.set(null);
    }

    this.vendorForm.patchValue({
      nameEn: data.name || '',
      nameAr: data.name_ar || '',
      crNumber,
      contact: mobileValue || '',
      email: emailValue || '',
      descriptionEn: data.description || '',
      descriptionAr: data.description_ar || '',
      logo: logoValue,
      linkinput: '',
      categories: Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : []),
      repFullName: data.smeName || '',
      repContactNumber: data.smePhone || '',
      repEmail: data.smeEmail || ''
    });

    // Handle links - can be string or string[]
    const linksArray = this.vendorForm.get('links') as FormArray;
    linksArray.clear();
    if (data.links) {
      const links = Array.isArray(data.links) ? data.links : (typeof data.links === 'string' ? [data.links] : []);
      links.forEach((link: any) => {
        if (link) {
          linksArray.push(new FormControl(link));
        }
      });
    }

    // Handle locations - can be Location[] or string; normalize to array
    const locationsArray = this.vendorForm.get('locations') as FormArray;
    locationsArray.clear();
    let locations: any[] = [];
    const rawLocations = data.locations;
    if (rawLocations != null) {
      if (Array.isArray(rawLocations)) {
        locations = rawLocations;
      } else if (typeof rawLocations === 'string') {
        try {
          const parsed = JSON.parse(rawLocations);
          locations = Array.isArray(parsed) ? parsed : [];
        } catch {
          locations = [];
        }
      } else if (typeof rawLocations === 'object' && !Array.isArray(rawLocations) && rawLocations !== null) {
        // Firestore or other clients may return object with numeric keys
        locations = Object.keys(rawLocations)
          .filter(k => /^\d+$/.test(k))
          .map(k => rawLocations[k]);
      }
    }

    if (locations.length === 0) {
      locationsArray.push(this.createLocationGroup());
    } else {
      locations.forEach((loc: any) => {
        const item = loc && typeof loc === 'object' ? loc : {};
        const locationGroup = this.fb.group({
          branchName: [item.branch_name ?? item.branchName ?? ''],
          branchNameAr: [item.branch_name_ar ?? item.branchNameAr ?? ''],
          city: [item.city ?? ''],
          address: [item.address ?? ''],
          googleMapLink: [item.link ?? item.googleMapLink ?? ''],
          latitude: [item.latitude != null ? Number(item.latitude) : null as number | null],
          longitude: [item.longitude != null ? Number(item.longitude) : null as number | null]
        });
        this.setupMapLinkSubscription(locationGroup);
        locationsArray.push(locationGroup);
      });
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

  backNavigation(){
      this.router.navigate([this.backNavRouteLink])
  }

  ngOnDestroy(): void {
    const url = this.logoPreviewUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}

