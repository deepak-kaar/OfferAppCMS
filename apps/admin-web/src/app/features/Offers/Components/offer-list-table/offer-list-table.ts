import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { PrimeUIModules } from '@offer-app/shared';



@Component({
  selector: 'app-offer-list-table',
  imports: [PrimeUIModules,CommonModule],
  templateUrl: './offer-list-table.html',
  styleUrl: './offer-list-table.css',
 

})
export class OfferListTable {
  searchOffer = signal<any>("")
  offers = [
  {
    image: 'assets/images/Container.png',
    title: '30% Off on Air Flight Tickets',
    discount: '30%',
    category: 'Travel',
    vendor: 'TravelX',
    startDate: '2023-05-20',
    type: 'Popular',
    status: true
  },
  {
    image: 'assets/images/Container.png',
    title: 'Summer Sale',
    discount: '60%',
    category: 'Fashion',
    vendor: 'Grapple Inc.',
    startDate: '2023-05-20',
    type: 'Popular',
    status: true
  },
  {
    image: 'assets/images/Container.png',
    title: 'Black Friday Mega Offer',
    discount: '40%',
    category: 'Food',
    vendor: 'One Stop',
    startDate: '2023-05-20',
    type: 'Occasional',
    status: false
  },
  // Add more...
];

addNewOffer(){

}
}
