import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  employee: any | null = '';

   ngOnInit(): void {
    const login = this.authService.getLoginFromToken();

    if (!login) {
      this.toastr.error('No se encontró login en el token');
      return;
    }

    this.employeeService.getEmployeeByLogin(login).subscribe({
      next: (data) => {
        this.employee = data;
      },
      error: (err) => {
        this.toastr.error('Error al obtener los datos del empleado.');
        console.error('Error al obtener los datos del empleado:', err);
        this.employee = null;
      }
    });
  }


}
