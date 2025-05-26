import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "C:/Users/DJesus/Documents/SPA_CRUD_Employee-DepartmentV2/frontend/node_modules/jwt-decode/build/esm/index";

export interface JwtPayload {
  login: string;
  // puedes añadir más propiedades si tu token las incluye
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000/api'; // Cambia según tu backend

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee`, data);
  }

  saveSession(res: { token: string }) {
    localStorage.setItem('token', res.token);

    const payload: JwtPayload = jwtDecode(res.token);
    localStorage.setItem('login', payload.login); // guardar login si quieres
  }

  logout() {
    localStorage.clear();
  }

  private readonly tokenKey = 'token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Decodifica JWT sin validar firma (solo para lectura)
  getLoginFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.login ?? null;
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getLoginFromToken() === 'admin';
  }
}
