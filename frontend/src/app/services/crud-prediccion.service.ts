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
export class CrudPrediccionService {

  private rest_API: string = 'http://localhost:8000/apiTFG/prediccion';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );

  constructor(private httpClient: HttpClient) { }

  crearPredi(numJornada: number, data: any): Observable<any> {
    return this.httpClient.post(`${this.rest_API}/createPredi/${numJornada}`, data, {headers: this.httpHeaders});
  }

  actualizarPredi(numJornada: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.rest_API}/actualizarPredi/${numJornada}`, data, {headers: this.httpHeaders});
  }

  deletePredi(numJornada: number): Observable<any> {
    return this.httpClient.delete(`${this.rest_API}/borrarPredi/${numJornada}`, {headers: this.httpHeaders});
  }

  getPrediByJornada(numJornada: number): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/${numJornada}`, {headers: this.httpHeaders});
  }
}
