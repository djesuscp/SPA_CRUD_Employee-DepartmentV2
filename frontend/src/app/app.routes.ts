import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { EmployeeGuard } from './core/guards/employee.guard';

// Lazy load de componentes standalone
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('./admin/pages/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'employee',
    canActivate: [EmployeeGuard],
    loadComponent: () =>
      import('./employee/pages/dashboard/employee-dashboard.component').then((m) => m.EmployeeDashboardComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];