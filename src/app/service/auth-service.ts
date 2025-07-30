import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  // ✅ Get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Check if any user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Get parsed user object from localStorage
  getUser(): any | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  // ✅ Get list of roles from the user object
  getUserRole(): string[] {
    const user = this.getUser();
    return user?.roleList || [];
  }

  // ✅ Check if current user has Admin role
   isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role === 'Admin';
  }

  // Check if current user is a regular User (and not Admin)
isUser(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role === 'User'; // ya 'Customer' as per backend
  }

  // ✅ Clear localStorage on logout
  logout(): void {
    localStorage.clear();
  }
}
