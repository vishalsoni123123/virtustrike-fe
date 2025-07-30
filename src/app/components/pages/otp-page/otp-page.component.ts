import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user-service';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrls: ['./otp-page.component.scss']
})
export class OtpPageComponent implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  timer: number = 30;
  isResendDisabled = true;
  intervalId: any;

  messageText: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: this.fb.array(
        Array(6).fill('').map(() => new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]')
        ])),
        Validators.required
      )
    });
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  get otpControls(): FormArray {
    return this.otpForm.get('otp') as FormArray;
  }

  getControl(index: number): FormControl {
    return this.otpControls.at(index) as FormControl;
  }

  onOtpInput(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (next) next.focus();
    }

    if (value.length === 0 && index > 0 && event.inputType === 'deleteContentBackward') {
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prev) prev.focus();
    }
  }

  startTimer(): void {
    this.timer = 30;
    this.isResendDisabled = true;
    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.isResendDisabled = false;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  showMessage(type: 'success' | 'error', text: string): void {
    this.messageType = type;
    this.messageText = text;

    setTimeout(() => {
      this.messageText = '';
      this.messageType = '';
    }, 4000);
  }

  resendOtp(): void {
    this.otpControls.controls.forEach(control => control.reset());
    this.startTimer();

    const mobileNumber = localStorage.getItem('loginMobileNumber');
    if (!mobileNumber) {
      this.showMessage('error', 'Session expired. Please login again.');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.userService.resendOtp(mobileNumber).subscribe({
      next: () => {
        this.showMessage('success', 'OTP resent successfully!');
      },
      error: () => {
        this.showMessage('error', 'Failed to resend OTP. Please login again.');
        this.router.navigate(['/sign-in']);
      }
    });
  }

  onSubmit(): void {
    if (this.otpForm.valid) {
      const otpValue = this.otpControls.value.join('');
      const mobileNumber = localStorage.getItem('loginMobileNumber');

      if (!mobileNumber) {
        this.showMessage('error', 'Session expired. Please login again.');
        this.router.navigate(['/sign-in']);
        return;
      }

      this.userService.verifyOtp({ mobileNumber, otp: otpValue }).subscribe({
        next: (res) => {
          if (res?.data?.user && res?.data?.token) {
            const token = res.data.token;
            const user = res.data.user;

            localStorage.clear();
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            this.showMessage('success', 'Login successful! Redirecting...');

            setTimeout(() => {
              if (user.role === 'Admin') {
                this.router.navigate(['/admin/dashboard']).then(() => window.location.reload());
              } else {
                this.router.navigate(['/']).then(() => window.location.reload());
              }
            }, 1000);
          } else {
            this.showMessage('error', 'Unexpected server response.');
          }
        },
        error: (err) => {
          const statusCode = err?.status;
          const serverMsg = err?.error?.message;

          if (statusCode === 400 || serverMsg?.toLowerCase()?.includes('invalid otp')) {
            this.showMessage('error', 'Invalid OTP. Please try again.');
          } else if (statusCode === 401 || serverMsg?.toLowerCase()?.includes('session expired')) {
            this.showMessage('error', 'Session expired. Please login again.');
            this.router.navigate(['/sign-in']);
          } else {
            this.showMessage('error', 'Something went wrong. Please try again.');
          }
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
      this.showMessage('error', 'Please enter the complete 6-digit OTP.');
    }
  }
}