import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeUIModules } from '@offer-app/shared';
import { OfferTile } from 'apps/admin-web/src/app/shared/Components/offer-tile/offer-tile';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { OfferList } from '../../services/offer-list';
import { OfferListItem } from '../../models/createOffer';


@Component({
  selector: 'app-offer-list-page',
  
  imports: [OfferTile,CommonModule,PrimeUIModules, CommonModule,
    FormsModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    
],
  templateUrl: './offer-list-page.html',
  styleUrl: './offer-list-page.css',
  standalone:true
})
export class OfferListPage {
    cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    selectedCity: any | undefined;
   searchOffer = signal<string>("");
   offers = signal<OfferListItem[]>([]);
locations = [
  { label: 'All', value: 'all' },
  { label: 'In-store', value: 'store' },
  { label: 'Online', value: 'online' }
];

statuses = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

redemptions = [
  { label: 'In-store', value: 'store' },
  { label: 'Online', value: 'online' }
];
loading = true;
selectedLocation = 'all';
selectedStatus = 'all';
selectedRedemption = 'store';
  constructor( private router:Router, private activatedRoute: ActivatedRoute ,private offerListService : OfferList){

    }

ngOnInit(){
      this.getOfferList()
}

filteredOffers = computed(() => {
    const term = this.searchOffer().toLowerCase().trim();
    const allOffers = this.offers();

    if (!term) return allOffers;

    return allOffers.filter(offer => 
      offer.title.toLowerCase().includes(term)
      
    )
  });
getOfferList() {
  this.offerListService.getAllOffers().subscribe({
    next: (res: OfferListItem[]) => {
      this.offers.set(res);
       this.loading = false;

    },
    error: (err: Error) => {
      console.error(err);
       this.loading = false;

    }
  });
}
addNewOffer(){
  this.router.navigate(['create'], { relativeTo: this.activatedRoute})
}
viewOfferDetails(offer:any){
   const id = offer._id.$oid;
  this.router.navigate(['detail', id], { relativeTo: this.activatedRoute });
}

}
