import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isNavOpen = false;
  isScrolled = false;
  isAnimationPlaying = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // No assignment needed for loggedIn if using a getter
  }

  // Getter: Use this.loggedIn to check if user is logged in
  get loggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }

  closeNav(): void {
    this.isNavOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const offset = window.scrollY;

    if (offset > 10 && !this.isScrolled) {
      this.isScrolled = true;
      this.isAnimationPlaying = true;

      setTimeout(() => {
        this.isAnimationPlaying = false;
      }, 1000);
    } else if (offset <= 10 && this.isScrolled) {
      this.isScrolled = false;
      this.isAnimationPlaying = false;
    }
  }
}
