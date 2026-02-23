import { Route } from '@angular/router';
import { TestApp } from './test';
import { MainLayout } from './main-layout/mainLayout';

export const appRoutes: Route[] = [


    {
        path:'',
        loadChildren: () => import('./main-layout/mainLayout.routes').then(m => m.routes)
    }
];
