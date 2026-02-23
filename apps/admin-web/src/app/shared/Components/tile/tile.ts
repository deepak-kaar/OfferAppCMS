import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PrimeUIModules } from '@offer-app/shared';

@Component({
  selector: 'app-tile',
  imports: [CommonModule,PrimeUIModules],
  templateUrl: './tile.html',
  styleUrl: './tile.css',
})
export class Tile {
  @Input() value!: string | number
  @Input() label!: string
  @Input() icon?: string
  @Input() iconColor!:string
  @Input() iconBackgroundColor!:string
}
