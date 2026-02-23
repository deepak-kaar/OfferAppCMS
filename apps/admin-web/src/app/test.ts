import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeUIModules } from '@offer-app/shared';

@Component({
  template: `
    <div class="card flex justify-center w-full mt-5">
      <p-datepicker [(ngModel)]="date" />
    </div>
  `,
  selector: 'app-test',
  standalone: true,
  imports: [PrimeUIModules, FormsModule],
})
export class TestApp {
  date: Date | undefined;
}
