import { Routes } from "@angular/router";
import { LayoutComponent } from "./shared/layout/layout.component";
import { authGuard } from "./core/guards/auth.guard";
import { noAuthGuard } from "./core/guards/no-auth.guard";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./auth/auth.routes").then((m) => m.AUTH_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: "admin",
    component: LayoutComponent,
    loadChildren: () =>
      import("./admin/admin.routes").then((m) => m.ADMIN_ROUTES),
    canActivate: [noAuthGuard],
  },

  { path: "**", redirectTo: "admin/usuarios", pathMatch: "full" },
];
