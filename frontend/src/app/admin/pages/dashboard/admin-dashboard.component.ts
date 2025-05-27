import { Component, inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';

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

  employees: any[] = [];
  departments: any[] = [];

  employeeForm: FormGroup;
  departmentForm: FormGroup;

  editingEmployeeId: string | null = null;
  editingDepartmentId: string | null = null;

  error: string = '';

  constructor() {
    const dniNieRegex = /^[XYZ]?\d{7,8}[A-Z]$/;
    const phoneRegex = /^\d{9}$/;

    this.employeeForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(dniNieRegex)]],
      fullName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      departmentId: ['', Validators.required]
    });

    this.departmentForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.fetchEmployees();
    this.fetchDepartments();
  }

  fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: (err) => this.error = 'Error loading employees'
    });
  }

  fetchDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => this.error = 'Error loading departments'
    });
  }

  submitEmployeeForm(): void {
    if (this.employeeForm.invalid) return;

    const data = this.employeeForm.getRawValue();
    data.departmentId = Number(data.departmentId);
    //const data = this.employeeForm.value;
    if (this.editingEmployeeId) {
      this.employeeService.updateEmployee(this.editingEmployeeId, data).subscribe(() => {
        this.fetchEmployees();
        this.employeeForm.reset();
        this.employeeForm.get('id')?.enable();
        this.editingEmployeeId = null;
      });
    } else {
      this.employeeService.createEmployee(data).subscribe(() => {
        this.fetchEmployees();
        this.employeeForm.reset();
        this.employeeForm.get('id')?.enable();
      });
    }
  }

  editEmployee(emp: any): void {
    this.editingEmployeeId = emp.id;
    this.employeeForm.patchValue(emp);
    this.employeeForm.get('id')?.disable();
  }

  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.fetchEmployees();
    });
  }

  submitDepartmentForm(): void {
    if (this.departmentForm.invalid) return;

    const data = this.departmentForm.value;
    if (this.editingDepartmentId) {
      this.departmentService.updateDepartment(this.editingDepartmentId, data).subscribe(() => {
        this.fetchDepartments();
        this.departmentForm.reset();
        this.editingDepartmentId = null;
      });
    } else {
      this.departmentService.createDepartment(data).subscribe(() => {
        this.fetchDepartments();
        this.departmentForm.reset();
      });
    }
  }

  editDepartment(dept: any): void {
    this.editingDepartmentId = dept.id;
    this.departmentForm.patchValue(dept);
  }

  deleteDepartment(id: string): void {
    this.departmentService.deleteDepartment(id).subscribe(() => {
      this.fetchDepartments();
    });
  }
}

