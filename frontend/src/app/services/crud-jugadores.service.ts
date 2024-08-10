import { Injectable } from '@angular/core';
import { Jugador } from '../models/jugador.model';
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
export class CrudJugadoresService {

  private rest_API: string = 'http://localhost:8000/apiTFG/jugadores';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );


  constructor(private httpClient: HttpClient) { }

  getJugadoresByIdApi(idApi: number): Observable<any> {
    console.log("Estoy en el método del service del front. IDAPI: ", idApi);
    
    return this.httpClient.get(`${this.rest_API}/equipo/${idApi}`, {headers: this.httpHeaders})
  }

  getJugadoresByPosicion(idApi: number, tipo:string): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/equipoT/${idApi}/${tipo}`, {headers: this.httpHeaders})
  }
  getMaximosGoleadores(): Observable<any> {
    return this.httpClient.get(`${this.rest_API}/goleadores`, {headers: this.httpHeaders})
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
