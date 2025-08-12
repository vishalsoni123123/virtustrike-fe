import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-profile',
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
    admin: any;
    showProfile = true;

    constructor(private router: Router) { }

    ngOnInit(): void {
        const adminString = localStorage.getItem('admin');
        if (adminString) {
            this.admin = JSON.parse(adminString);
        }
    }

    closeProfile() {
        this.showProfile = false;
        this.router.navigate(['/']);
    }
}