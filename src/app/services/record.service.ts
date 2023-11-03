import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private apiUrl = 'http://localhost:3000/api/records';

  private addRecordSubject = new BehaviorSubject<void>(undefined);
  addRecord$ = this.addRecordSubject.asObservable();

  constructor(private http: HttpClient) {}

  getRecords(): Observable<any> {
    const endpoint = `${this.apiUrl}/getAll`;
    return this.http.get(endpoint);
  }

  async addRecord(recordData: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/create`;
    return this.http.post(endpoint, recordData).pipe(
      tap(() => {
        this.addRecordSubject.next();
      })
    );
  }

  async editRecord(recordData: any) {
    const endpoint = `${this.apiUrl}/edit/${recordData._id}`;
    return this.http.patch(endpoint, recordData).pipe(
      tap(() => {
        this.addRecordSubject.next();
      })
    );
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
