import { Component, inject, Inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeUIModules } from '@offer-app/shared';
import { GetVendorById } from '../../services/get-vendor-by-id';
import { VendorDetails } from '../../models/vendordetails';
import { DeactiveVendorById } from '../../services/deactive-vendor-by-id';
import { DeleteVendorById } from '../../services/delete-vendor-by-id';
import { ActivateVendorById } from '../../services/activate-vendor-by-id';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-vendor-detail-page',
  imports: [PrimeUIModules],
  templateUrl: './vendor-detail-page.html',
  styleUrl: './vendor-detail-page.css',
  providers: [ConfirmationService, MessageService],
})
export class VendorDetailPage {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  vendorDetails = signal<VendorDetails>({} as VendorDetails);
  vendorId = signal<string>('');
  isLoading = signal<boolean>(true);

  constructor(
    private router: Router,
    private _routeId: ActivatedRoute,
    private vendorById: GetVendorById,
    private deactivateVendorService: DeactiveVendorById,
    private deleteVendorService: DeleteVendorById,
    private activateVendorService: ActivateVendorById
  ) {}

  ngOnInit() {
    const vendorID = this._routeId.snapshot.paramMap.get('id')!;
    this.vendorId.set(vendorID);
    console.log(vendorID);

    this.getVendorDetailsById(vendorID)
  }

  getVendorDetailsById(id: string) {
    this.vendorById.getVendorById(id).subscribe({
      next: (res: VendorDetails) => {
        console.log('Vendor details received:', res);
        console.log('Logo URL:', res.logo);
        this.isLoading.set(false);
        this.vendorDetails.set(res);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        console.log(err)
      }
    })
  }

  goBack() {
    this.router.navigate(['/vendors']);
  }

  deleteVendorById() {

    this.confirmationService.confirm({
      message: 'Vendor will be deleted are you sure',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.deleteVendorService.deleteVendor(this.vendorId()).subscribe({
          next: res => {
            console.log('Vendor created', res);

            this.messageService.add({
              severity: 'success',
              summary: 'Vendor Deleted',
              life: 2200,
              detail: 'Vendor deleted Successfully',

            });
            this.goBack()
          },

          error: err => {
            console.log(err);

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to Delete vendor',
              life: 2200,
            });
            this.goBack()
          }
        });
      }
    });
  }
  deactivateVendorById() {
    // this.deactivateVendorService.deactiveVendor(this.vendorId()).subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //   },
    //   error: (err: Error) => {
    //     console.log(err);
    //   }
    // })
    this.confirmationService.confirm({
      message: 'Vendor will be deactivated are you sure',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Deactivate',
        severity: 'primary'
      },
      accept: () => {
        this.deactivateVendorService.deactiveVendor(this.vendorId()).subscribe({
          next: res => {
            console.log('Vendor created', res);

            this.messageService.add({
              severity: 'success',
              summary: 'Vendor Deactivated',
              life: 2200,
              detail: 'Vendor Deactivated Successfully',

            });
            this.goBack()
          },

          error: err => {
            console.log(err);

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to Deactivate the vendor',
              life: 2200,
            });
            this.goBack()
          }
        });
      }
    });
  }
  editVendorDetailsById() {
    this.router.navigate(['/vendors/edit', this.vendorId()], {
      relativeTo: this._routeId,
    });
  }

  activateVendorById() {
    this.confirmationService.confirm({
      message: 'This vendor will be activated. Continue?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Activate',
        severity: 'success',
      },
      accept: () => {
        this.activateVendorService.activateVendor(this.vendorId()).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Vendor Activated',
              detail: 'Vendor has been activated successfully.',
              life: 2200,
            });
            this.getVendorDetailsById(this.vendorId());
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to activate vendor.',
              life: 2200,
            });
          },
        });
      },
    });
  }
}
