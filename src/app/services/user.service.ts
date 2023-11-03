import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  signup(formData: any): Observable<any> {
    console.log('formData---', formData);

    const endpoint = `${this.apiUrl}/register`;
    return this.http.post(endpoint, formData);
  }
}
