import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PrimeUIModules } from '@offer-app/shared';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule,CommonModule,PrimeUIModules,AvatarModule, BreadcrumbModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
     items: MenuItem[] = [];
    home:any;
    navItems = signal<any>([
        { icon: "pi pi-home p-2", navItem: "Dashboard", title: "Dashboard",navLink:"/dashboard" },
        { icon: "pi pi-inbox", navItem: "Request Center", title: "Request Center",navLink:"/requestcenter"  },
        { icon: "pi pi-users", navItem: "Vendors", title: "Vendor Management",navLink:"/vendors"  },
        { icon: "pi pi-tags", navItem: "Offers", title: "Offers", navLink:"/offers" },
        { icon: "pi pi-star", navItem: "Highlights", title: "Highlights",navLink:"/highlights"  },
        { icon: "pi pi-envelope", navItem: "Messaging Center", title: "Messaging Center",navLink:"/support"  },
        { icon: "pi pi-comment", navItem: "Feedback", title: "Feedback",navLink:"/feedback"  },
        { icon: "pi pi-chart-line", navItem: "Analytics", title: "Analytics" ,navLink:"/analytics" },
        { icon: "pi pi-cog", navItem: "Settings", title: "Settings",navLink:"/settings"  },
        { icon: "pi pi-book", navItem: "System Logs", title: "System Logs" ,navLink:"/systemLogs" }
        ,{ icon: "pi pi-bell", navItem: "Notification", title: "Notification",navLink:"/notifications"  }
      
    ])
    protected readonly title = signal('OfferAppAdmin');
     visible: boolean = false;
      @ViewChild('drawerRef') drawerRef!: Drawer;
      @Output() sendNavBarHeader = new EventEmitter<string>();
    closeCallback(e:any): void {
        this.drawerRef.close(e);
    }
    ngOnInit() {
           this.items = [{ label: 'Electronics' }, { label: 'Computer' }, { label: 'Accessories' }, { label: 'Keyboard' }, { label: 'Wireless' }];
        this.home = { icon: 'pi pi-home' };
    }
    navigate(item:any){
        this.sendNavBarHeader.emit(item.title);
    }




}
