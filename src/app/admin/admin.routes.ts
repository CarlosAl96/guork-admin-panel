import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ProductsComponent } from './products/products.component';
import { ContractsComponent } from './contracts/contracts.component';
import { NextInvoicesComponent } from './next-invoices/next-invoices.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DealersComponent } from './dealers/dealers.component';
import { superAdminGuard } from '../core/guards/super-admin.guard';
import { AwardsComponent } from './awards/awards.component';
import { SellersComponent } from './sellers/sellers.component';
import { PaymentsSellerComponent } from './payments-seller/payments-seller.component';
import { NotificationsComponent } from './notifications/notifications.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'calendario', component: CalendarComponent },
  {
    path: 'dealers',
    component: DealersComponent,
    canActivate: [superAdminGuard],
  },
  { path: 'usuarios', component: UsersComponent },
  { path: 'pagos', component: InvoicesComponent },
  { path: 'productos', component: ProductsComponent },
  { path: 'contratos', component: ContractsComponent },
  { path: 'proximos-pagos', component: NextInvoicesComponent },
  { path: 'adjudicaciones', component: AwardsComponent },
  { path: 'vendedores', component: SellersComponent },
  { path: 'pagos-vendedores', component: PaymentsSellerComponent },
  { path: 'notificaciones', component: NotificationsComponent },
  { path: '**', redirectTo: 'usuarios' },
];
