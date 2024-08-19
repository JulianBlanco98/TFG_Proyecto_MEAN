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

  // private const tipo3 = 'tipo_3'

  constructor(private httpClient: HttpClient) { }


  crearPredi(numJornada: number, tipo: number, data: any): Observable<any> {
    return this.httpClient.post(`${this.rest_API}/createPredi/${numJornada}/${tipo}`, data, {headers: this.httpHeaders});
  }

  actualizarPredi(numJornada: number, tipo: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.rest_API}/actualizarPredi/${numJornada}/${tipo}`, data, {headers: this.httpHeaders});
  }

  deletePredi(numJornada: number, tipo: number): Observable<any> {
    return this.httpClient.delete(`${this.rest_API}/borrarPredi/${numJornada}/${tipo}`, {headers: this.httpHeaders});
  }

  getPrediByJornada(numJornada: number): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/${numJornada}`, {headers: this.httpHeaders});
  }

  getPrediccionesHechas(): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/historico`, {headers: this.httpHeaders});
  }

}
