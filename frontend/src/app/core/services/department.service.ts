import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DepartmentService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/department/`);
  }

  createDepartment(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/department/`, data);
  }

  updateDepartment(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/department/${id}`, data);
  }

  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/department/${id}`);
  }

}
