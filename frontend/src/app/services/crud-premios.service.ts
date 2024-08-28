import { Injectable } from '@angular/core';
import { Premio } from '../models/premio.model';
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
export class CrudPremiosService {

  private rest_API: string = 'http://localhost:8000/apiTFG/premios';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );

  constructor(private httpClient: HttpClient) { }

  getPremios(): Observable<any> {
    return this.httpClient.get(this.rest_API, {headers: this.httpHeaders});
  }

  getPremioById(idPremio: string): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/${idPremio}`, {headers: this.httpHeaders})
  }

  canjearPremio(idPremio: string): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/canjearPremio/${idPremio}`, {headers: this.httpHeaders})
  }

  crearPremio(data: FormData): Observable<any> {
    return this.httpClient.post(this.rest_API, data, {headers: this.httpHeaders});
  }

}
