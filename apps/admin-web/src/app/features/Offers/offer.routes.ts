import { Route } from '@angular/router';
import { OfferMainPage } from './pages/offer-main-page/offer-main-page';
import { OfferListPage } from './pages/offer-list-page/offer-list-page';
import { OfferCreatePage } from './pages/offer-create-page/offer-create-page';
import { OfferDetailById } from './services/offer-detail-by-id';
import { EditOffer } from './services/edit-offer';
import { OfferDetailsPage } from './pages/offer-details-page/offer-details-page';
import { OfferEditPage } from './pages/offer-edit-page/offer-edit-page';


export const routes: Route[] = [

      {
            path:'',
            component:OfferMainPage,
            children:[
                   {
                      path:'',
                        component:OfferListPage
                    },
                   {
                      path:'create',
                        component:OfferCreatePage
                    },
                      {
                        path:'detail/:id',
                        component:OfferDetailsPage
                    },
                      {
                        path:'edit/:id',
                        component:OfferEditPage
                    },
            ]
        }
     
];