// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { AdminDashboardComponent } from './admin/pages/dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './employee/pages/dashboard/employee-dashboard.component';
import { routes } from './app.routes';

@NgModule({
  imports: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    EmployeeDashboardComponent,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  //bootstrap: [AppComponent]
})
export class AppModule { }
