import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
//import { canActivate } from '@angular/router';
import { inject } from '@angular/core';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
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
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
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

