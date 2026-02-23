import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { PrimeUIModules } from '@offer-app/shared';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CreateVendor } from '../../models/createNewVendor';
import { VendorForm } from 'apps/admin-web/src/app/shared/Components/vendor-form/vendor-form';
import { RegisterNewVendor } from '../../services/register-new-vendor';
import { MessageService, ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-vendor-create-page',
  imports: [ReactiveFormsModule, FormsModule, PrimeUIModules, VendorForm],
  templateUrl: './vendor-create-page.html',
  styleUrl: './vendor-create-page.css',
  providers: [ConfirmationService, MessageService]
})
export class VendorCreatePage {
  vendorForm!: FormGroup;
  isLoading:boolean = false;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  constructor(private location: Location, private router: Router, private vendorService: RegisterNewVendor) { }

  ngOnInit(): void {

  }

  //  submitForm() {
  //   if (this.vendorForm.valid) {
  //     console.log('Form Data:', this.vendorForm.value);
  //     const vendorPayload = this.mapFormToVendor(this.vendorForm.value);
  //     // const formData = this.buildFormData(vendorPayload);
  //     this.vendorService.createVendor(vendorPayload).subscribe({
  //      next: (res) => {
  //         console.log(res)
  //      },
  //      error: err => {
  //         console.log(err)
  //      }
  // });
  //   } else {
  //     this.markFormGroupTouched(this.vendorForm);
  //   }
  // }

  handleVendorSubmit(payload: CreateVendor) {
    console.log('handleVendorSubmit called with payload:', payload);
    this.confirmationService.confirm({
      message: 'New Vendor will be created',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Create',
        severity: 'secondary'
      },
      accept: () => {
        this.vendorService.createVendor(payload).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Vendor Created',
              detail: 'The vendor has been successfully added.',
              life: 2200,
            });
            setTimeout(() => this.goBack(), 1500);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create vendor. Please try again.',
              life: 4000,
            });
          },
        });
      }
    });

  }

  goBack() {
    this.router.navigate(['/vendors']);
  }



}
