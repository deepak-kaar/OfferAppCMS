import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { Router , NavigationEnd} from '@angular/router';
import { PrimeUIModules } from '@offer-app/shared';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,PrimeUIModules,AvatarModule, BreadcrumbModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
      navHeader = signal<string>('')
      @Input() headerData!: string;
       constructor(private router:Router){

    }
      ngOnInit(){
           this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      console.log('Route changed to:', event.urlAfterRedirects);
      this.navHeader.set(`${event.urlAfterRedirects.split('/')}`)
    });
      }
}
