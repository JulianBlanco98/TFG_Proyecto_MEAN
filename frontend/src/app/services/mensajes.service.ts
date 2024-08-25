import { Injectable } from '@angular/core';
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
export class MensajesService {

  private rest_API: string = 'http://localhost:8000/apiTFG/mensajes';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );

  constructor(private httpClient: HttpClient) { }

  getMensajes(): Observable<any> {
    return this.httpClient.get(this.rest_API, {headers: this.httpHeaders})
  }

  crearMensaje(data: any): Observable<any> {
    return this.httpClient.post(this.rest_API, data, {headers: this.httpHeaders});
  }

}
