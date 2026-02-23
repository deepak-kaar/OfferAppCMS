import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PrimeUIModules } from '@offer-app/shared';

@Component({
  selector: 'app-offer-tile',
  imports: [CommonModule,PrimeUIModules],
  templateUrl: './offer-tile.html',
  styleUrl: './offer-tile.css',
})
export class OfferTile {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() subtitle = '';
  @Input() icon = 'pi pi-chart-bar';
  @Input() bgColor = 'bg-white';

}
