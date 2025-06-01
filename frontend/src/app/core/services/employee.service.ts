import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employee/`);
  }

  getEmployeeById(id: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/employees/${id}`);
  }

  createEmployee(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/employee/register`, data);
  }

  updateEmployee(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/employee/${id}`, data);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employee/${id}`);
  }
}
