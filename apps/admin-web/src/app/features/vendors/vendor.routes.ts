import { Route } from '@angular/router';
import { VendorListPage } from './pages/vendor-list-page/vendor-list-page';
import { VendorCreatePage } from './pages/vendor-create-page/vendor-create-page';
import { VendorDetailPage } from './pages/vendor-detail-page/vendor-detail-page';
import { VendorMainPage } from './pages/vendor-main-page/vendor-main-page';
import { EditVendorDetails } from './pages/edit-vendor-details/edit-vendor-details';

export const routes: Route[] = [


    {
        path:'',
        component:VendorMainPage,
        children:[
               {
                  path:'',
                    component:VendorListPage
                },
               {
                  path:'create',
                    component:VendorCreatePage
                },
                  {
                    path:'detail/:id',
                    component:VendorDetailPage
                },
                  {
                    path:'edit/:id',
                    component:EditVendorDetails
                },
        ]
    }
     
];