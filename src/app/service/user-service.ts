import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) {
    this.baseUrl = this.urlService.getBaseUrl();
  }

  // -------------------- USER SECTION --------------------

  // User Registration
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/sign-up`, userData);
  }

  // Get All Users (Paginated)
  findAllUsers(page: number, size: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/findAllUser?page=${page}&size=${size}`);
  }

  // Soft Delete / Restore User by ID
  softDeleteById(id: number, status: number = 0): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/soft-delete?id=${id}&status=${status}`);
  }

  // Forgot Password - Send Mobile + New Password
  forgotPassword(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/forgotUserPassword`, data);
  }

  // -------------------- OTP LOGIN SECTION --------------------

  // OTP Request for Login
  signin(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/sign-in/request`, userData);
  }

  // OTP Verification for Login
  verifyOtp(otpData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/sign-in/verify`, otpData);
  }

  // Resend OTP for Login (empty body)
  resendOtp(mobileNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/sign-in/request`, { mobileNumber });
  }

  // -------------------- PASSWORD RESET via OTP --------------------

  // Request OTP for Password Reset
  requestResetPasswordOtp(data: { mobileNumber: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/forgot-password/request`, data);
  }

  // Verify OTP and Reset Password
  verifyOtpAndResetPassword(data: {
    otp: string,
    mobileNumber: string,
    password: string
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/forgot-password/verify`, data);
  }

  // -------------------- AUTH UTILITY --------------------

  isLoggedIn(): boolean {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return false;

      const user = JSON.parse(userString);
      return user && user.userId != null && user.userId !== '' && user.role === 'USER';
    } catch (e) {
      return false;
    }
  }

  getUserRole(): string | null {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return null;

      const user = JSON.parse(userString);
      return user.role;
    } catch {
      return null;
    }
  }

  getUserId(): number | null {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return null;

      const user = JSON.parse(userString);
      return user.userId;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
  }
}