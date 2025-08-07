import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { UserService } from 'src/app/service/user-service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  passwordEntered: boolean = false;

  @ViewChild('registerSuccessModal') registerSuccessModal!: ElementRef;
  @ViewChild('registerErrorModal') registerErrorModal!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]{3,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && (controlName === 'password'
      ? this.passwordEntered
      : (control.dirty || control.touched));
  }

  onPasswordInput(): void {
    this.passwordEntered = true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const userPayload = {
        fullName: formValue.fullName,
        email: formValue.email,
        mobileNumber: formValue.mobileNumber,
        gender: formValue.gender,
        password: formValue.password,
        dateOfBirth: formValue.dob
      };

      this.userService.signup(userPayload).subscribe({
        next: (response) => {
          const modal = new bootstrap.Modal(this.registerSuccessModal.nativeElement);
          modal.show();

          this.registerForm.reset();
          this.passwordEntered = false;
          this.showPassword = false;

          setTimeout(() => {
            modal.hide();
            this.router.navigate(['/sign-in']);
          }, 2000);
        },
        error: () => {
          const modal = new bootstrap.Modal(this.registerErrorModal.nativeElement);
          modal.show();
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}