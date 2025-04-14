import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Consultation } from './consultation.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = '/api/consultations';  // Using proxy configuration

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client error:', error.error.message);
    } else {
      // Backend error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getConsultations(): Observable<Consultation[]> {
    console.log('Fetching consultations from:', this.apiUrl);
    return this.http.get<Consultation[]>(this.apiUrl)
      .pipe(
        tap(consultations => console.log('Fetched consultations:', consultations)),
        catchError(this.handleError)
      );
  }

  addConsultation(consultation: Consultation): Observable<Consultation> {
    console.log('Adding consultation:', consultation);
    return this.http.post<Consultation>(this.apiUrl, consultation)
      .pipe(
        tap(newConsultation => console.log('Added consultation:', newConsultation)),
        catchError(this.handleError)
      );
  }

  updateConsultation(id: string, consultation: Consultation): Observable<Consultation> {
    console.log('Updating consultation:', id, consultation);
    return this.http.put<Consultation>(`${this.apiUrl}/${id}`, consultation)
      .pipe(
        tap(updatedConsultation => console.log('Updated consultation:', updatedConsultation)),
        catchError(this.handleError)
      );
  }

  deleteConsultation(id: string): Observable<void> {
    console.log('Deleting consultation:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => console.log('Deleted consultation:', id)),
        catchError(this.handleError)
      );
  }
}
