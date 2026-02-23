import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeUIModules } from '@offer-app/shared';
import { Tile } from 'apps/admin-web/src/app/shared/Components/tile/tile';
import { InputTextModule } from 'primeng/inputtext';
import { GetVendorList } from '../../services/get-vendor-list';
import { VendorDetails } from '../../models/vendordetails';
import { DeleteVendorById } from '../../services/delete-vendor-by-id';
import { DeactiveVendorById } from '../../services/deactive-vendor-by-id';

@Component({
  selector: 'app-vendor-list-page',
  imports: [Tile, PrimeUIModules, CommonModule, InputTextModule, FormsModule],
  templateUrl: './vendor-list-page.html',
  styleUrl: './vendor-list-page.css',
  providers: [ConfirmationService, MessageService],
})
export class VendorListPage {
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    vendorListData = signal<VendorDetails[]>([]);
    isLoading = signal<boolean>(true);
    searchQuery = '';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private vendorList: GetVendorList,
        private deleteVendorService: DeleteVendorById,
        private deactivateVendorService: DeactiveVendorById,
    ) {}
    ngOnInit() {
     this.getVendorList()
    }

      AddNewVendor(){
        console.log(this.router)
        // console.log(this.activatedRoute)
         this.router.navigate(['create'], { relativeTo: this.activatedRoute})
    }


    
 navigateVendorDetails(vendor: any) {
  const id = vendor._id.$oid;
  this.router.navigate(['detail', id], { relativeTo: this.activatedRoute });
}

    formatdate(date: string): string {
        const isoDate = date;
        return new Date(isoDate).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    }

    /** Filtered vendors by search query (all table columns). */
    get filteredVendors(): VendorDetails[] {
        return this.filterVendorsByQuery(this.vendorListData(), this.searchQuery);
    }

    private filterVendorsByQuery(list: VendorDetails[], query: string): VendorDetails[] {
        const q = (query || '').trim().toLowerCase();
        if (!q) return list;
        return list.filter((v) => this.vendorMatchesQuery(v, q));
    }

    private vendorMatchesQuery(v: VendorDetails, q: string): boolean {
        const name = (v.name ?? '').toLowerCase();
        const nameAr = (v.name_ar ?? '').toLowerCase();
        const contact = Array.isArray(v.email) ? (v.email as string[]).join(' ').toLowerCase() : String(v.email ?? '').toLowerCase();
        const offersCount = String(v.offers?.length ?? 0);
        const locationsCount = String(v.locations?.length ?? 0);
        const status = v.isActive ? 'active' : 'in-active';
        const regDate = this.formatdate((v.createdAt as { $date: string })?.$date ?? '');
        return (
            name.includes(q) ||
            nameAr.includes(q) ||
            contact.includes(q) ||
            offersCount.includes(q) ||
            locationsCount.includes(q) ||
            status.includes(q) ||
            regDate.toLowerCase().includes(q)
        );
    }

  getVendorList() {
    this.vendorList.getAllVendors().subscribe({
      next: (res: VendorDetails[]) => {
        this.vendorListData.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  deleteVendor(vendor: VendorDetails, event: Event) {
    event.stopPropagation();
    const id = vendor._id?.$oid ?? vendor._id;
    this.confirmationService.confirm({
      message: 'This vendor will be marked as deleted (soft delete). Continue?',
      header: 'Delete vendor',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancel',
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Delete', severity: 'danger' },
      accept: () => {
        this.deleteVendorService.deleteVendor(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Vendor deleted',
              detail: 'Vendor has been marked as deleted.',
              life: 2200,
            });
            this.getVendorList();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete vendor.',
              life: 2200,
            });
          },
        });
      },
    });
  }

  deactivateVendor(vendor: VendorDetails, event: Event) {
    event.stopPropagation();
    const id = vendor._id?.$oid ?? vendor._id;
    this.confirmationService.confirm({
      message: 'This vendor will be deactivated. Continue?',
      header: 'Deactivate vendor',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancel',
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Deactivate', severity: 'primary' },
      accept: () => {
        this.deactivateVendorService.deactiveVendor(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Vendor deactivated',
              detail: 'Vendor has been deactivated.',
              life: 2200,
            });
            this.getVendorList();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to deactivate vendor.',
              life: 2200,
            });
          },
        });
      },
    });
  }
}
