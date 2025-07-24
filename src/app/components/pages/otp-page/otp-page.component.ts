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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

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

    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.isResendDisabled = false;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  resendOtp(): void {
    this.otpControls.controls.forEach(control => control.reset());
    this.startTimer();

    const mobileNumber = localStorage.getItem('loginMobileNumber');
    if (!mobileNumber) {
      alert('Session expired. Please login again.');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.userService.resendOtp(mobileNumber).subscribe({
      next: () => {
        console.log('OTP resent successfully');
      },
      error: (err) => {
        console.error('Failed to resend OTP:', err);
        alert('Session expired or invalid. Please login again.');
        this.router.navigate(['/sign-in']);
      }
    });
  }

  onSubmit(): void {
    if (this.otpForm.valid) {
      const otpValue = this.otpControls.value.join('');
      const mobileNumber = localStorage.getItem('loginMobileNumber');

      if (!mobileNumber) {
        alert('Session expired. Please login again.');
        this.router.navigate(['/sign-in']);
        return;
      }

      this.userService.verifyOtp({ mobileNumber, otp: otpValue }).subscribe({
        next: (res) => {
          console.log('Full login response:', res);

          if (res?.data?.user && res?.data?.token) {
            const token = res.data.token;
            const user = res.data.user;

            // ✅ Clear previous session and set new values
            localStorage.clear();
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // ✅ Navigate and refresh the page to update navbar
            if (user.role === 'Admin') {
              this.router.navigate(['/admin/dashboard']).then(() => {
                window.location.reload();
              });
            } else {
              this.router.navigate(['/']).then(() => {
                window.location.reload();
              });
            }
          } else {
            alert('Unexpected response format from server.');
          }
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Invalid OTP or server error';
          alert(errorMsg);
          console.error(err);
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
    }
  }
}