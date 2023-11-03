import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private apiUrl = 'http://localhost:3000/api/records';

  constructor(private http: HttpClient) {}

  getRecords(): Observable<any> {
    const endpoint = `${this.apiUrl}/getAll`;
    return this.http.get(endpoint);
  }

  async addRecord(recordData: any) {
    console.log('recordDaya', recordData);

    const endpoint = `${this.apiUrl}/create`;
    const add = this.http.post(endpoint, recordData);
    console.log('add---->', add);

    return add;
  }

  async editRecord(recordData: any) {
    console.log('recordDaya', recordData);

    console.log('recordData._id', recordData._id);

    const endpoint = `${this.apiUrl}/edit/${recordData._id}`;
    const edited = this.http.patch(endpoint, recordData);
    console.log('add---->', edited);

    return edited;
  }

  deleteRecord(id: any): Observable<any> {
    try {
      const endpoint = `${this.apiUrl}/delete/${id}`;
      return this.http.delete(endpoint);
    } catch (e) {
      console.log('e', e);
      return of(e);
    }
  }
}
