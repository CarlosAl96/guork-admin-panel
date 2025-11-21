import { Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";

export const ADMIN_ROUTES: Routes = [
  { path: "usuarios", component: UsersComponent },
  { path: "**", redirectTo: "usuarios" },
];
