import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  contactForm: FormGroup;
  submitted = false;
  submitting = false;
  error = '';
  private isBrowser: boolean;

  // Replace this URL with your deployed Google Apps Script web app URL
  private readonly GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzbjt6xVGDMTnh0snUNeIPxjrBEvOVgKxbCZJgjB2AWZnHPKjVi8VYZC9mHDtUuqWI/exec';

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (!this.contactForm.valid || !this.isBrowser) return;

    this.submitting = true;
    this.error = '';

    try {
      const response = await fetch(this.GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.contactForm.value)
      });

      // no-cors mode returns opaque response, so we assume success
      this.submitted = true;
      this.contactForm.reset();
    } catch (err) {
      this.error = 'Something went wrong. Please try again or email us directly.';
    } finally {
      this.submitting = false;
    }
  }
}
