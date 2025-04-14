import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Diary } from './diary.model';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private apiUrl = '/api/diaries';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client error:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getDiaries(): Observable<Diary[]> {
    console.log('Fetching diaries from:', this.apiUrl);
    return this.http.get<Diary[]>(this.apiUrl)
      .pipe(
        tap(diaries => console.log('Fetched diaries:', diaries)),
        catchError(this.handleError)
      );
  }

  addDiary(diary: Diary): Observable<Diary> {
    console.log('Adding diary:', diary);
    return this.http.post<Diary>(this.apiUrl, diary)
      .pipe(
        tap(newDiary => console.log('Added diary:', newDiary)),
        catchError(this.handleError)
      );
  }

  updateDiary(id: string, diary: Diary): Observable<Diary> {
    console.log('Updating diary:', id, diary);
    return this.http.put<Diary>(`${this.apiUrl}/${id}`, diary)
      .pipe(
        tap(updatedDiary => console.log('Updated diary:', updatedDiary)),
        catchError(this.handleError)
      );
  }

  deleteDiary(id: string): Observable<void> {
    console.log('Deleting diary:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => console.log('Deleted diary:', id)),
        catchError(this.handleError)
      );
  }
}
