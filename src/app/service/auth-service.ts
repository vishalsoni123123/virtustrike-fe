import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  // Get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if any user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Get parsed user object from localStorage
  getUser(): any | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      // Optional: console.error('User parse error', error);
      return null;
    }
  }

  // Get user role(s)
  getUserRoles(): string[] {
    const user = this.getUser();
    // Support for both single role and array of roles
    if (!user) return [];
    if (Array.isArray(user.roleList)) return user.roleList;
    if (typeof user.role === 'string') return [user.role];
    return [];
  }

  // Check if user has Admin role
  isAdmin(): boolean {
    return this.getUserRoles().includes('Admin');
  }

  // Check if user has User or Customer role
  isUser(): boolean {
    return this.getUserRoles().includes('User') || this.getUserRoles().includes('Customer');
  }

  // Clear session data
  logout(): void {
    localStorage.clear();
  }
}