import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/service/contact-service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {
  contactForm: FormGroup;

  nameLength = 0;
  emailLength = 0;
  mobileNumberLength = 0;
  subjectLength = 0;
  messageLength = 0;

  isSubmitting = false;
  submitError = '';
  showSuccessMessage = false;
  isClosing = false; // closing animation flag

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return control?.invalid && (control.dirty || control.touched) || false;
  }

  onInput(field: string): void {
    const control = this.contactForm.get(field);
    if (!control) return;

    let value = control.value || '';
    switch (field) {
      case 'name':
        value = value.slice(0, 30);
        this.nameLength = value.length;
        break;
      case 'email':
        value = value.slice(0, 50);
        this.emailLength = value.length;
        break;
      case 'mobileNumber':
        value = value.replace(/\D/g, '').slice(0, 10);
        this.mobileNumberLength = value.length;
        break;
      case 'subject':
        value = value.slice(0, 100);
        this.subjectLength = value.length;
        break;
      case 'message':
        value = value.slice(0, 500);
        this.messageLength = value.length;
        break;
    }
    control.setValue(value, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    const formValue = this.contactForm.value;

    const contactData = {
      ...formValue,
      description: formValue.message
    };
    delete contactData.message;

    this.contactService.addContact(contactData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.contactForm.reset();
        this.resetCharCounts();
        this.showSuccessMessage = true;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = 'Something went wrong. Please try again later.';
        console.error('Contact form submission error:', err);
      }
    });
  }

  closeSuccessMessage(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.isClosing = false;
    }, 300); // fade-out duration
  }

  private resetCharCounts(): void {
    this.nameLength = 0;
    this.emailLength = 0;
    this.mobileNumberLength = 0;
    this.subjectLength = 0;
    this.messageLength = 0;
  }
}