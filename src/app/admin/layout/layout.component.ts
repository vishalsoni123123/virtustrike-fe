import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isScrolled = false;
  isProfileDropdownOpen = false;

  // Add variables for profile pic and name
  profileName: string = '';
  profileImage: string = 'assets/images/others-img/admin.png';

  constructor(private router: Router) { }

  ngOnInit(): void {
    //localStorage user/admin data load 
    const userString = localStorage.getItem('user') || localStorage.getItem('admin');
    if (userString) {
      const userData = JSON.parse(userString);
      this.profileName = userData.fullName || userData.name || 'Unknown User';
      this

      if (userData.profileImageUrl) {
        this.profileImage = userData.profileImageUrl;
      }
    }
  }

  toggleSidebar(): void {
    if (window.innerWidth <= 1024) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  goToAdminProfile(): void {
    this.router.navigate(['/admin-profile']);
    this.isProfileDropdownOpen = false;
  }

  logout(): void {
    // Clear token and related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Reset UI state variables
    this.isSidebarCollapsed = false;
    this.isMobileMenuOpen = false;
    this.isScrolled = false;
    this.isProfileDropdownOpen = false;
    this.profileName = '';
    this.profileImage = 'assets/images/web-logo/logo.png';

    // Navigate to login page
    this.router.navigate(['/login']);
  }
}