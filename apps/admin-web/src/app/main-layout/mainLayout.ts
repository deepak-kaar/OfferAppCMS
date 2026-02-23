import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { PrimeUIModules } from '@offer-app/shared';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Drawer } from 'primeng/drawer';
import { Sidenav } from './Components/sidenav/sidenav';
import { Navbar } from './Components/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [ RouterModule,RouterOutlet,CommonModule,PrimeUIModules,AvatarModule, BreadcrumbModule,Sidenav,Navbar],
  templateUrl: './mainLayout.html',
  styleUrl: './mainLayout.css',
providers: [ConfirmationService, MessageService]
})
export class MainLayout {
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
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

    constructor(private router:Router){

    }
    protected readonly title = signal('OfferAppAdmin');
     visible: boolean = false;
      @ViewChild('drawerRef') drawerRef!: Drawer;
       receivedHeaderData:string = ""
    closeCallback(e:any): void {
        this.drawerRef.close(e);
    }


  

    ngOnInit() {
           this.items = [{ label: 'Electronics' }, { label: 'Computer' }, { label: 'Accessories' }, { label: 'Keyboard' }, { label: 'Wireless' }];
        this.home = { icon: 'pi pi-home' };
        console.log(this.router.url)
    }

    handledata(value:any){
        this.receivedHeaderData = value
    }
}
