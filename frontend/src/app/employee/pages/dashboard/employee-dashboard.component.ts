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
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private toastr = inject(ToastrService);

  employee: any | null = '';

  // ngOnInit(): void {
  //   this.fetchEmployees();
  // }

  fetchEmployees(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
    next: (data) => {
      const { password, ...employeeWithoutPassword } = data;
      this.employee = employeeWithoutPassword;
      console.log(this.employee);
      console.log('Departamento:', this.employee.department.name);
    },
    error: (err) => {
      this.employee = null;
      if (err.status === 404) {
        this.toastr.info('Empleado no encontrado.');
      } else {
        this.toastr.error('Error al cargar el empleado.');
      }
    }
  });
  }

}
