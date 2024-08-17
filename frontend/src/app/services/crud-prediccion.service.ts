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
  private tipo1 = 'tipo_1'
  private tipo2 = 'tipo_2'
  // private const tipo3 = 'tipo_3'

  constructor(private httpClient: HttpClient) { }

  //Esto es el crud para las predicciones de tipo 1: quiniela

  crearPredi(numJornada: number, data: any): Observable<any> {
    return this.httpClient.post(`${this.rest_API}/${this.tipo1}/createPredi/${numJornada}`, data, {headers: this.httpHeaders});
  }

  actualizarPredi(numJornada: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.rest_API}/${this.tipo1}/actualizarPredi/${numJornada}`, data, {headers: this.httpHeaders});
  }

  deletePredi(numJornada: number): Observable<any> {
    return this.httpClient.delete(`${this.rest_API}/${this.tipo1}/borrarPredi/${numJornada}`, {headers: this.httpHeaders});
  }

  getPrediByJornada(numJornada: number): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/${this.tipo1}/${numJornada}`, {headers: this.httpHeaders});
  }

  //Crud para las predicciones de tipo 2: goles
  createPrediTipo2(numJornada: number, data: any) {
    return this.httpClient.post(`${this.rest_API}/${this.tipo2}/createPredi/${numJornada}`, data, {headers: this.httpHeaders});
  }
}
