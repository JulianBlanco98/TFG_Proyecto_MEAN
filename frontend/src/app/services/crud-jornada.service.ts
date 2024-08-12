import { Injectable } from '@angular/core';
import { Jornada } from '../models/jornada.model';
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
export class CrudJornadaService {

  private rest_API: string = 'http://localhost:8000/apiTFG/jornada';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );
  constructor(private httpClient: HttpClient) { }

  getJornadaByNumero(idJornada: number): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/${idJornada}`, {headers: this.httpHeaders})
  }

  simularJornadaAdmin(): Observable<any> {
    return this.httpClient.put(`${this.rest_API}/s/simularJornada`, {}, {headers: this.httpHeaders});
  }

  getNumeroJornadaActual(): Observable<any>{
    return this.httpClient.get(`${this.rest_API}/j/actual`, {headers: this.httpHeaders});
  }

  getNumeroJornadaNovedad(): Observable<any>{
    return this.httpClient.get(`${this.rest_API}/j/novedades`, {headers: this.httpHeaders});
  }
  
  getGoleadorJornadaActual(): Observable<any>{
    return this.httpClient.get(`${this.rest_API}/goleadorJornada`, {headers: this.httpHeaders});
  }
  
  getAsistenteJornadaActual(): Observable<any>{
    return this.httpClient.get(`${this.rest_API}/asistenteJornada`, {headers: this.httpHeaders});
  }

  getPartido(numJornada: number, numPartido: number): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/partido/${numJornada}/${numPartido}`, {headers: this.httpHeaders})
  }
}
