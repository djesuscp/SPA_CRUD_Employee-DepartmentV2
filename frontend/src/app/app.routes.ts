import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
//import { canActivate } from '@angular/router';
import { inject } from '@angular/core';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { AdminDashboardComponent } from './admin/pages/dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './employee/pages/dashboard/employee-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { EmployeeGuard } from './core/guards/employee.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: 'employee', component: EmployeeDashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

