import { Injectable } from '@angular/core';
import { Clasificacion } from '../models/clasificacion.model';
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
export class GetClasificacionService {

  private rest_API: string = 'http://localhost:8000/apiTFG/clasificacion'
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );

  constructor(private httpClient: HttpClient) { }

  getTablaClasificacion(): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/clasificacion`, {headers: this.httpHeaders})
  }
  
  getMultiPrediccion1(): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/multi`, {headers: this.httpHeaders})
  }

}
