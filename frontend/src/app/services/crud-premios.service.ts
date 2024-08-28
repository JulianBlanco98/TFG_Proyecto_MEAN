import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudPremiosService {

  private rest_API: string = 'http://localhost:8000/apiTFG/premios';

  constructor(private httpClient: HttpClient) { }

  getPremios(): Observable<any> {
    return this.httpClient.get(this.rest_API, {headers: new HttpHeaders().set('Content-type', 'application/json')});
  }

  getPremioById(idPremio: string): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/${idPremio}`, {headers: new HttpHeaders().set('Content-type', 'application/json')});
  }

  canjearPremio(idPremio: string): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/canjearPremio/${idPremio}`, {headers: new HttpHeaders().set('Content-type', 'application/json')});
  }

  crearPremio(data: FormData): Observable<any> {
    return this.httpClient.post(this.rest_API, data); // No incluyas 'Content-Type' en los headers
  }
}
