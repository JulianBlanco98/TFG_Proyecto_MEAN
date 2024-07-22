import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
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
export class CrudUsersService {

  private rest_API: string = 'http://localhost:8000/apiTFG/users';
  private httpHeaders = new HttpHeaders().set(
    'Content-type',
    'application/json'
  );

  constructor(private httpClient: HttpClient) { }

  registro(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.rest_API}/registro`, data, {headers: this.httpHeaders})
  }

  login (data: any): Observable<any> {
    return this.httpClient
      .post(`${this.rest_API}/login`, data, {headers: this.httpHeaders})
  }


}


