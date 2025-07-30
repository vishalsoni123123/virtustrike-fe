import { Component } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        Location,
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent {
    title = 'VirtuStrike - Angular 16 Theme';

    location: any;
    routerSubscription: any;
    isAdminRoute: boolean = false;

    constructor(private router: Router) { }

    ngOnInit() {
        this.recallJsFuntions();
    }

    recallJsFuntions() {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
            .subscribe(event => {
                this.location = this.router.url;

                // Check if the current URL starts with '/admin'
                this.isAdminRoute = this.location.startsWith('/admin');

                // Scroll to top only after successful navigation
                if (event instanceof NavigationEnd) {
                    window.scrollTo(0, 0);
                }
            });
    }
}