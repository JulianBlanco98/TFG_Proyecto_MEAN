import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  private rest_API: string = 'http://localhost:8000/api/usuarios/';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );

  constructor(private httpClient: HttpClient) {}

  getUsuarios() {
    return this.httpClient.get(this.rest_API, { headers: this.httpHeaders });
  }
  getusuario(id: any) {
    return this.httpClient
      .get(`this.REST_API/${id}`, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => {
          return res || {};
        })
      );
  }
  createUsuario(data: Usuario) {
    return this.httpClient
      .post(this.rest_API, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }
  updateUsuario(id: any, data: Usuario) {
    return this.httpClient
      .put(`this.REST_API/${id}`, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }
  deleteUsuario(id: any) {
    return this.httpClient
      .delete(`this.REST_API/${id}`, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
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
