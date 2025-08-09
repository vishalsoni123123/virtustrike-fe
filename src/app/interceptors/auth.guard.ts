import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      // Admin is logged in — allow access
      return true;
    } else {
      // Not logged in or not admin — redirect to login
      return this.router.parseUrl('/login');
    }
  }
}
