import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user-service';

@Component({
  selector: 'app-verify-reset-otp',
  templateUrl: './verify-reset-otp.component.html',
  styleUrls: ['./verify-reset-otp.component.scss']
})
export class VerifyResetOtpComponent implements OnInit {
  otpForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: this.fb.array(
        Array(6).fill('').map(() => this.fb.control('', [Validators.required, Validators.pattern('[0-9]')])),
        Validators.required
      )
    });
  }

  get otpControls(): FormArray {
    return this.otpForm.get('otp') as FormArray;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.otpForm.valid) {
      const otp = this.otpControls.value.join('');
      const mobileNumber = localStorage.getItem('resetMobileNumber');
      const password = localStorage.getItem('resetNewPassword');

      if (!mobileNumber || !password) {
        this.errorMessage = 'Missing data. Please restart the password reset process.';
        this.router.navigate(['/forgot-password']);
        return;
      }

      const payload = { otp, mobileNumber, password };

      this.userService.verifyOtpAndResetPassword(payload).subscribe({
        next: () => {
          this.successMessage = 'Password reset successfully! Redirecting to login...';
          setTimeout(() => {
            localStorage.removeItem('resetMobileNumber');
            localStorage.removeItem('resetNewPassword');
            this.router.navigate(['/sign-in']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Invalid OTP. Please try again.';
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  moveToNext(event: any, index: number) {
    const input = event.target;
    if (input.value && index < 5) {
      const nextInput = document.getElementById('otp-' + (index + 1));
      nextInput?.focus();
    }
  }
}