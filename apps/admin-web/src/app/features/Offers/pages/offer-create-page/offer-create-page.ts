import { Component, inject } from '@angular/core';
import { OfferForm } from 'apps/admin-web/src/app/shared/Components/offer-form/offer-form';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OfferFormModel } from '../../models/createOffer';
import { Router } from '@angular/router';
import { CreateNewOffer } from '../../services/create-new-offer';
import { PrimeUIModules } from '@offer-app/shared';

@Component({
  selector: 'app-offer-create-page',
  imports: [OfferForm,PrimeUIModules],
  templateUrl: './offer-create-page.html',
  styleUrl: './offer-create-page.css',
  providers: [ConfirmationService, MessageService]
})
export class OfferCreatePage {

  constructor(private router:Router,private createNewOfferService : CreateNewOffer){

  }
  isLoading:boolean = false;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  handleOfferSubmit(payload:any ) {
    console.log(payload);
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
        this.createNewOfferService.createNewOffer(payload).subscribe({
          next: res => {
            console.log('Vendor created', res);
            this.goBack()
            this.messageService.add({
              severity: 'success',
              summary: 'Vendor Created',
              life: 2200,
              detail: 'The vendor has been successfully added',
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
