import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Generative IT Solution — Build Digital Products That Deliver' },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), title: 'About — Generative IT Solution' },
  { path: 'services', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent), title: 'Services — Generative IT Solution' },
  { path: 'contacts', loadComponent: () => import('./pages/contacts/contacts.component').then(m => m.ContactsComponent), title: 'Contact — Generative IT Solution' },
  { path: 'terms', loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent), title: 'Terms of Service — Generative IT Solution' },
  { path: 'privacy', loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent), title: 'Privacy Policy — Generative IT Solution' },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent), title: '404 — Page Not Found' }
];
