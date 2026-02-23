import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeUIModules } from '@offer-app/shared';
import { OfferDetailById } from '../../services/offer-detail-by-id';

@Component({
  selector: 'app-offer-details-page',
  imports: [PrimeUIModules,CommonModule],
  templateUrl: './offer-details-page.html',
  styleUrl: './offer-details-page.css',
})
export class OfferDetailsPage {
  OfferBasicData = signal<any>(null);
  locations = signal([
    { name: 'Riyadh Park Mall', branch: 'Northern Ring Branch', distance: '2.5 km' },
    { name: 'Olaya Street', branch: 'Downtown District', distance: '1.8 km' }
  ]);

constructor(private router : Router, private activatedRoute: ActivatedRoute ,private getOfferByIdService : OfferDetailById){

}
ngOnInit(){
  this.getOfferDetailsById()

}

getOfferDetailsById(){
      const vendorID = this.activatedRoute.snapshot.paramMap.get('id')!;
      this.getOfferByIdService.getOfferById(vendorID).subscribe({
        next:(res:any) => {
          console.log(res)
          this.OfferBasicData.set(res);
        },
        error:(err:Error) =>{
          console.log(err)
        }
      })
}

back() {
    this.router.navigate(['/offers']);
  }

  navigateToEditOffer(){
        const offerID = this.activatedRoute.snapshot.paramMap.get('id')!;
         this.router.navigate(['/offers/edit', offerID], { relativeTo: this.activatedRoute });
  }


}
