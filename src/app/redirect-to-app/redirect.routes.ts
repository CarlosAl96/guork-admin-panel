import { Routes } from '@angular/router';
import { RedirectToAppComponent } from './redirect-to-app.component';

export const REDIRECT_ROUTES: Routes = [
  { path: '', component: RedirectToAppComponent },
  { path: '**', redirectTo: '' },
];
