import { Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { ProfilesComponent } from "./profiles/profiles.component";
import { RequestsComponent } from "./requests/requests.component";
import { InvoicesComponent } from "./invoices/invoices.component";

export const ADMIN_ROUTES: Routes = [
  { path: "usuarios", component: UsersComponent },
  { path: "perfiles", component: ProfilesComponent },
  { path: "solicitudes", component: RequestsComponent },
  { path: "pagos", component: InvoicesComponent },
  { path: "**", redirectTo: "usuarios" },
];
