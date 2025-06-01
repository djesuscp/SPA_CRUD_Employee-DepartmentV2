import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-register',
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
  private toastr = inject(ToastrService);

  employees: any[] = [];

  constructor() {
    const dniNieRegex = /^[XYZ]?\d{7,8}[A-Z]$/;

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

  onSubmit() {
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
