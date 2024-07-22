import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CrudUsersService {

  private rest_API: string = 'http://localhost:8000/apiTFG/users';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );

  constructor(private httpClient: HttpClient) { }

  registro(data: User): Observable<any> {
    return this.httpClient
      .post(`${this.rest_API}/registro`, data, {headers: this.httpHeaders})
      .pipe(catchError(this.handleError))
  }

  login (nombreUsuario: string, password: string): Observable<any> {
    return this.httpClient
      .post(`${this.rest_API}/login`, {nombreUsuario, password}, {headers: this.httpHeaders})
      .pipe(catchError(this.handleError))
  }


  handleError(error: HttpErrorResponse) {
    let errorMensaje: string = '';
    if (error.error instanceof ErrorEvent) {
      errorMensaje = error.error.message;
    } else {
      errorMensaje = `Error code: ${error.status}. Mensaje: ${error.message}`;
    }

    return throwError(() => {
      errorMensaje;
    });
  }
}


