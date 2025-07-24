import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user-service';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent {
  signInForm: FormGroup;
  isLoading = false;
  signInSuccess = false;
  signInError: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.signInForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSignIn(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.signInError = null;

    const loginData = {
      mobileNumber: this.signInForm.value.mobileNumber,
      password: this.signInForm.value.password
    };

    this.userService.signin(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Save for OTP verification
        localStorage.setItem('loginMobileNumber', loginData.mobileNumber);
        this.signInSuccess = true;

        setTimeout(() => {
          this.router.navigate(['/verify-otp']);
          this.signInForm.reset();
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.signInError = error?.error?.message || 'Sign-in failed. Please try again.';
      }
    });
  }
}