import { Route } from '@angular/router';
import { MainLayout } from './mainLayout';
import { TestApp } from '../test';
import { Component } from '@angular/core';
import { VendorMainPage } from '../features/vendors/pages/vendor-main-page/vendor-main-page';
import { VendorCreatePage } from '../features/vendors/pages/vendor-create-page/vendor-create-page';
import { VendorDetailPage } from '../features/vendors/pages/vendor-detail-page/vendor-detail-page';
import { VendorListPage } from '../features/vendors/pages/vendor-list-page/vendor-list-page';
import { OfferMainPage } from '../features/Offers/pages/offer-main-page/offer-main-page';



export const routes: Route[] = [


    {
        path:'',
        component:MainLayout,
        children:[
            {
            path:'dashboard',
            component:TestApp
            },
              {
            path:'vendors',
            component:VendorMainPage,
            loadChildren: () => import('../features/vendors/vendor.routes').then(m => m.routes)
            },
              {
            path:'offers',
            component:OfferMainPage,
            loadChildren: () => import('../features/Offers/offer.routes').then(m => m.routes)
            },
              {
            path:'requestcenter',
            component:TestApp
            }
        ]
    },
     
];
