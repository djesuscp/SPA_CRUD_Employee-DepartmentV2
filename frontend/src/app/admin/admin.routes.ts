// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component'; // o el que uses

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    // puedes añadir canActivate aquí si usas authGuard o adminGuard
  }
];
