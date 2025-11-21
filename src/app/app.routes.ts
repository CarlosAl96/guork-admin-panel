import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: LayoutComponent,
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [noAuthGuard],
  },
  {
    path: 'to-app',
    loadChildren: () =>
      import('../app/redirect-to-app/redirect.routes').then(
        (m) => m.REDIRECT_ROUTES
      ),
  },
  {
    path: 'delete-account',
    component: DeleteAccountComponent,
  },
  { path: '**', redirectTo: 'admin/usuarios', pathMatch: 'full' },
];
