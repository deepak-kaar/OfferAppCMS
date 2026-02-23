import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateVendor } from '../../models/createNewVendor';
import { CreateNewVendor } from 'apps/admin-web/src/app/services/create-new-vendor';
import { VendorForm } from 'apps/admin-web/src/app/shared/Components/vendor-form/vendor-form';
import { PrimeUIModules } from '@offer-app/shared';
import { GetVendorById } from '../../services/get-vendor-by-id';
import { VendorDetails } from '../../models/vendordetails';
import { UpdateVendorDetails } from '../../services/update-vendor-details';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-edit-vendor-details',
  imports: [PrimeUIModules,VendorForm],
  templateUrl: './edit-vendor-details.html',
  styleUrl: './edit-vendor-details.css',
  providers: [ConfirmationService, MessageService]
})
export class EditVendorDetails {
   private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  constructor(private router  :Router,private vendordetailsByID : GetVendorById,private _routeId: ActivatedRoute,private saveEditedVendorDetails : UpdateVendorDetails ){
   }
   vendorDetailsById = signal<VendorDetails | null>(null);
   loadEditVendorComponent = signal<boolean>(false);
    isLoading = signal<boolean>(true);
ngOnInit(){
  this.getVendorDetailsById()
}

getVendorDetailsById(){
  const vendorID = this._routeId.snapshot.paramMap.get('id')!;
  console.log('Fetching vendor details for ID:', vendorID);
  
  if (!vendorID) {
    console.error('No vendor ID found in route');
    this.isLoading.set(false);
    return;
  }
  
  this.vendordetailsByID.getVendorById(vendorID).subscribe({
    next:(res:VendorDetails) => {
      console.log('Vendor details received:', res);
      this.vendorDetailsById.set(res);
      console.log('Vendor details signal set:', this.vendorDetailsById());
      this.isLoading.set(false);
    },
    error:(err:Error) => {
      console.error('Error fetching vendor details:', err);
      this.isLoading.set(false);
      // Optionally show error message to user
    }
  });
}
   goBack() {
  this.router.navigate(['/vendors']);
}

handleVendorSubmit(payload: CreateVendor) {
    console.log(payload);
     const vendorID = this._routeId.snapshot.paramMap.get('id')!;
     console.log(vendorID);

     this.confirmationService.confirm({
      message: 'Edited Details will be saved',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Save',
        severity: 'primary'
      },
      accept: () => {
         this.saveEditedVendorDetails.saveVendor(payload,vendorID).subscribe({
          next: res => {
            console.log('Vendor created', res);
          
            this.messageService.add({
              severity: 'success',
              summary: 'Vendor Details Update',
              detail: 'The vendor Details has been successfully Updated',
              life: 2200,
            });
             this.goBack()
          },

          error: err => {
            console.log(err);
          
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update vendor',
              life: 2200,
            });

            this.goBack()
          }
        });
      }
    });
}


}
