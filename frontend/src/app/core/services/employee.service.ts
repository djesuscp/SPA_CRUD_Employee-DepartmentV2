import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = '/api/employee';

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createEmployee(data: any): Observable<any> {
  return this.http.post('/api/employee/register', data);
  }

  updateEmployee(id: string, data: any): Observable<any> {
    return this.http.put(`/api/employee/${id}`, data);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`/api/employee/${id}`);
  }

}
