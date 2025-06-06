import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  login: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly tokenKey = 'token';
  private readonly baseUrl = 'http://localhost:3000/api';

  login(data: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/login`, data);
    }
  
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee`, data);
  }
  
  saveSession(res: { token: string }) {
    localStorage.setItem('token', res.token);
    const payload: JwtPayload = jwtDecode(res.token);
    localStorage.setItem('login', payload.login);
    if (payload.login === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/employee']);
    }
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getLoginFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload: JwtPayload = jwtDecode(token);
    return payload.login;
  }
  
  isAdmin(): boolean {
    return this.getLoginFromToken() === 'admin';
  }
  
    // Decodifica JWT sin validar firma (solo para lectura)
    // getLoginFromToken(): string | null {
    //   const token = this.getToken();
    //   if (!token) return null;
  
    //   try {
    //     const payload = JSON.parse(atob(token.split('.')[1]));
    //     return payload?.login ?? null;
    //   } catch (e) {
    //     return null;
    //   }
    // }



  // private apiUrl = 'http://localhost:3000/api'; // ajusta si es necesario

  // login(credentials: { email: string; password: string }) {
  //   return this.http.post<{ token: string; role: string }>(`${this.apiUrl}/login`, credentials).pipe(
  //     tap((res) => {
  //       localStorage.setItem('token', res.token);
  //       localStorage.setItem('role', res.role);
  //     })
  //   );
  // }

  // register(data: any) {
  //   return this.http.post(`${this.apiUrl}/empleado`, data);
  // }

  // saveSession(res: { token: string }) {
  //   localStorage.setItem('token', res.token);
  //   const payload: JwtPayload = jwtDecode(res.token);
  //   localStorage.setItem('login', payload.login); // guardar login si quieres
  // }


  // logout() {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('role');
  //   this.router.navigate(['/login']);
  // }

  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  // getLoginFromToken(): string | null {
  //   const token = localStorage.getItem('token');
  //   if (!token) return null;

  //   const payload: JwtPayload = jwtDecode(token);
  //   return payload.login;
  // }
}
