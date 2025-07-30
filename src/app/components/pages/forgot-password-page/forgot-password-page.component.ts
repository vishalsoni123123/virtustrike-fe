import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user-service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss'],
})
export class ForgotPasswordPageComponent {
  forgotPasswordForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.forgotPasswordForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get mobileNumber() {
    return this.forgotPasswordForm.get('mobileNumber')!;
  }

  get newPassword() {
    return this.forgotPasswordForm.get('newPassword')!;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const requestData = this.forgotPasswordForm.value;

      this.userService.requestResetPasswordOtp(requestData).subscribe({
        next: () => {
          this.successMessage = 'OTP sent successfully!';
          this.errorMessage = '';

          localStorage.setItem('resetMobileNumber', requestData.mobileNumber);
          localStorage.setItem('resetNewPassword', requestData.newPassword);

          setTimeout(() => {
            this.router.navigate(['/verify-reset-otp']);
          }, 1000);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to send OTP.';
          this.successMessage = '';
        },
      });
    }
  }
}
