import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PrimeUIModules } from '@offer-app/shared';

import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-vendor-main-page',
  imports: [PrimeUIModules,CommonModule,InputTextModule, FormsModule, RouterModule,RouterOutlet],
  templateUrl: './vendor-main-page.html',
  styleUrl: './vendor-main-page.css',
})
export class VendorMainPage {
    vendorListData!: any[];
    value2: string | undefined;
    constructor( ){

    }
    ngOnInit() {
    }



}
