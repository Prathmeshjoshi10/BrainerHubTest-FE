import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {}

  signup(formData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/register`;
    return this.http.post(endpoint, formData);
  }

  signin(formData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/login`;
    return this.http.post(endpoint, formData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  isLoggedInUser() {
    if (this.getToken()) {
      return true;
    } else {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserDetails(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['signin']);
  }
}
