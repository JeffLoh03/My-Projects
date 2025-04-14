import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = '/api/todos';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client error:', error.error.message);
      return throwError(() => error.error.message);
    } else {
      // Server-side error
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
      return throwError(() => error);
    }
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl)
      .pipe(
        tap(todos => console.log('Fetched todos:', todos)),
        catchError(this.handleError)
      );
  }

  addTodo(todo: Todo): Observable<Todo> {
    console.log('Adding todo:', todo);
    return this.http.post<Todo>(this.apiUrl, todo)
      .pipe(
        tap(newTodo => console.log('Added todo:', newTodo)),
        catchError(this.handleError)
      );
  }

  updateTodo(id: string, todo: Todo): Observable<Todo> {
    console.log('Updating todo:', id, todo);
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo)
      .pipe(
        tap(updatedTodo => console.log('Updated todo:', updatedTodo)),
        catchError(this.handleError)
      );
  }

  deleteTodo(id: string): Observable<void> {
    console.log('Deleting todo:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => console.log('Deleted todo:', id)),
        catchError(this.handleError)
      );
  }
}
