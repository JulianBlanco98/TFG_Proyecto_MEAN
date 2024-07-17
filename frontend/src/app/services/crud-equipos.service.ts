import { Injectable } from '@angular/core';
import { Equipo } from '../models/equipo.model';
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
export class CrudEquiposService {

  private rest_API: string = 'http://localhost:8000/apiTFG/equipos';
  //private rest_API_2: string = 'http://localhost:8000/apiTFG/jugadores';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );

  constructor(private httpClient: HttpClient) { }

  getEquipos(): Observable<any> {
    return this.httpClient.get(this.rest_API, {headers: this.httpHeaders})
  }
  getEquiposOrdenados(): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/ord`, {headers: this.httpHeaders})
  }

  

}
