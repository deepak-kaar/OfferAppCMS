import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeUIModules } from '@offer-app/shared';
import { OfferForm } from 'apps/admin-web/src/app/shared/Components/offer-form/offer-form';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CreateNewOffer } from '../../services/create-new-offer';
import { EditOffer } from '../../services/edit-offer';
import { OfferDetailById } from '../../services/offer-detail-by-id';

@Component({
  selector: 'app-offer-edit-page',
  imports: [OfferForm,PrimeUIModules],
  templateUrl: './offer-edit-page.html',
  styleUrl: './offer-edit-page.css',
  providers: [ConfirmationService, MessageService]
})
export class OfferEditPage {
    constructor(private router:Router,private editOfferDetails:EditOffer,private _routeId: ActivatedRoute, private offerDetailService :OfferDetailById){

  }
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

    offerDetailsById = signal<any | null>(null);
   loadEditVendorComponent = signal<boolean>(false);
    isLoading = signal<boolean>(true);
ngOnInit(){
  this.getOfferDetailsById()
}

getOfferDetailsById(){
  const offerID = this._routeId.snapshot.paramMap.get('id')!;
  console.log('Fetching vendor details for ID:', offerID);
  
  if (!offerID) {
    console.error('No vendor ID found in route');
    this.isLoading.set(false);
    return;
  }
  
  this.offerDetailService.getOfferById(offerID).subscribe({
    next:(res:any) => {
      console.log('Vendor details received:', res);
      this.offerDetailsById.set(res);
      console.log('Vendor details signal set:', this.offerDetailsById());
      this.isLoading.set(false);
    },
    error:(err:Error) => {
      console.error('Error fetching vendor details:', err);
      this.isLoading.set(false);
      // Optionally show error message to user
    }
  });
}



   handleOfferSubmit(payload:any ) {
     const offerID = this._routeId.snapshot.paramMap.get('id')!;
    console.log(payload);
     console.log('handleVendorSubmit called with payload:', payload);
    this.confirmationService.confirm({
      message: 'Offer Details will be saved',
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
        severity: 'Primary'
      },
      accept: () => {
        this.editOfferDetails.editOfferDetailsById(offerID,payload).subscribe({
          next: res => {
            console.log('Vendor created', res);
            this.goBack()
            this.messageService.add({
              severity: 'success',
              summary: 'Offer Edited',
              life: 2200,
              detail: 'Offer Edited Succefully',
            });
          },

          error: err => {
            console.log(err);
            this.goBack()

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create vendor',
              life: 2200,
            });
          }
        });
      }
    });

  }

  goBack() {
    this.router.navigate(['/offers']);
  }
}
