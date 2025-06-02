import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  employeeForm: FormGroup;
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private toastr = inject(ToastrService);

  employees: any[] = [];
  departments: any[] = [];

  constructor() {
    const dniNieRegex = /^(?:\d{8}|[XYZ]\d{7})[A-Z]$/
;

    this.employeeForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(dniNieRegex)]],
      fullName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchEmployees();
    this.fetchDepartments();
  }

  fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe({
    next: (data) => this.employees = data,
    error: (err) => {
      this.employees = [];
      if (err.status === 404) {
        this.toastr.info('No hay empleados registrados.');
      } else {
        this.toastr.error('Error al cargar los empleados.');
      }
    }
  });
  }

  fetchDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => {
        this.departments = [];
        if (err.status === 404) {
          this.toastr.info('No hay departamentos registrados.');
        } else {
          this.toastr.error('Error al cargar departamentos.');
        }
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;
    const data = this.employeeForm.getRawValue();
    data.departmentId = Number(data.departmentId);
    this.employeeService.createEmployee(data).subscribe({
      next: () => {
          this.toastr.success('Empleado creado correctamente.');
          this.fetchEmployees();
          this.employeeForm.reset();
          this.employeeForm.get('id')?.enable();
        },
        error: (err) => {
          if (err.status === 409) {
            this.toastr.error('El ID o login ya existe.');
          } else {
            this.toastr.error('Error al crear empleado.');
          }
        }
      });
  }
}
