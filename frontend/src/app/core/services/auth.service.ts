import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

Injectable({
  providedIn: 'root',
})

export interface JwtPayload {
  login: string;
  // puedes añadir más propiedades si tu token las incluye
}

export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api'; // ajusta si es necesario

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string; role: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/empleado`, data);
  }

  saveSession(res: { token: string }) {
    localStorage.setItem('token', res.token);
    const payload: JwtPayload = jwtDecode(res.token);
    localStorage.setItem('login', payload.login); // guardar login si quieres
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getLoginFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload: JwtPayload = jwtDecode(token);
    return payload.login;
  }


  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
