import { Component } from '@angular/core';
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

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitted = true;
      this.contactForm.reset();
    }
  }
}
