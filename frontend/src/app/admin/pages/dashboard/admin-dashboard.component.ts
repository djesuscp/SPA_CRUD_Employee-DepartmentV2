import { Component, inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private auth = inject(AuthService);
  private toastr = inject(ToastrService);

  employees: any[] = [];
  departments: any[] = [];

  employeeForm: FormGroup;
  departmentForm: FormGroup;

  editingEmployeeId: string | null = null;
  editingDepartmentId: string | null = null;

  error: string = '';

  constructor() {
    // Regular expresions to check ID and phone.
    const dniNieRegex = /^(?:\d{8}|[XYZ]\d{7})[A-Z]$/;
    const phoneRegex = /^\d{9}$/;

    this.employeeForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(dniNieRegex)]],
      fullName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      departmentId: ['', Validators.required]
    });

    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // First thing that loads into the page are employees and departments.
  ngOnInit(): void {
    this.fetchEmployees();
    this.fetchDepartments();
  }

  // GET employees.
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

  // GET departments.
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

  // PUT or POST employee.
  submitEmployeeForm(): void {
    if (this.employeeForm.invalid) return;

    const data = this.employeeForm.getRawValue();
    data.departmentId = Number(data.departmentId);
    if (this.editingEmployeeId) {
      this.employeeService.updateEmployee(this.editingEmployeeId, data).subscribe({
        next: (res) => {
          this.toastr.success('Empleado actualizado correctamente.');
          this.fetchEmployees();
          this.employeeForm.reset();
          this.employeeForm.get('id')?.enable();
          this.editingEmployeeId = null;
        },
        error: (err) => {
          if (err.status === 403) {
            this.toastr.error('No se puede editar al administrador.');
          } else if (err.status === 409) {
            this.toastr.error('El DNI o login ya existe.');
          } else {
            this.toastr.error('Error al actualizar empleado.');
          }
        }
      });
    } else {
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

  // Manage employee ID depending on PUT or POST state.
  editEmployee(emp: any): void {
    this.editingEmployeeId = emp.id;
    this.employeeForm.patchValue(emp);
    this.employeeForm.get('id')?.disable();
  }

  // DELETE employee.
  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: (res) => {
          this.toastr.success('Empleado eliminado correctamente.');
          this.fetchEmployees();
        },
        error: (err) => {
          if (err.status === 403) {
            this.toastr.error('No se puede eliminar al administrador.'); // 'Cannot delete the admin user.'
          } else {
            this.toastr.error('Error al eliminar el empleado.');
          }
        }
      });
  }

  // PUT or POST department.
  submitDepartmentForm(): void {
    if (this.departmentForm.invalid) return;

    const data = this.departmentForm.value;
    if (this.editingDepartmentId) {
      this.departmentService.updateDepartment(this.editingDepartmentId, data).subscribe({
        next: () => {
          this.toastr.success('Departamento actualizado correctamente.');
          this.fetchDepartments();
          this.departmentForm.reset();
          this.editingDepartmentId = null;
        },
        error: () => this.toastr.error('Error al actualizar departamento.')
      });
    } else {
      this.departmentService.createDepartment(data).subscribe({
        next: () => {
          this.toastr.success('Departamento creado correctamente.');
          this.fetchDepartments();
          this.departmentForm.reset();
        },
        error: () => this.toastr.error('Error al crear departamento.')
      });
    }
  }

  // Manage department ID to avoid edition.
  editDepartment(dept: any): void {
    this.editingDepartmentId = dept.id;
    this.departmentForm.patchValue({
      name: dept.name,
      phone: dept.phone,
      email: dept.email
    });
  }

  // DELETE department.
  deleteDepartment(id: string): void {
      this.departmentService.deleteDepartment(id).subscribe({
      next: () => {
        this.toastr.success('Departamento eliminado.');
        this.fetchDepartments();
      },
      error: () => this.toastr.error('Error al eliminar departamento. Existen empleados vinculados.')
    });
  }

  logOut() {
    this.auth.logout();
  }
}

