import { Component, signal, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TestApp } from './test';
import { CommonModule } from '@angular/common';
import { PrimeUIModules } from '@offer-app/shared';
import { MenuItem } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  imports: [ RouterModule,RouterOutlet,CommonModule,PrimeUIModules,AvatarModule, BreadcrumbModule ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  
})
export class App {
  
  
    protected readonly title = signal('OfferAppAdmin');
     visible: boolean = false;
      @ViewChild('drawerRef') drawerRef!: Drawer;

    closeCallback(e:any): void {
        this.drawerRef.close(e);
    }

    ngOnInit() {
         
    }
}
