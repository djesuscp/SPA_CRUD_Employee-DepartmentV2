import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DepartmentService {
  private http = inject(HttpClient);
  private baseUrl = '/api/department';

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>('/api/department/');
  }

  createDepartment(data: any): Observable<any> {
  return this.http.post('/api/department/', data);
  }

  updateDepartment(id: string, data: any): Observable<any> {
    return this.http.put(`/api/department/${id}`, data);
  }

  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`/api/department/${id}`);
  }

}
