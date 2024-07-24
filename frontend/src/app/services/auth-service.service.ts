import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly TOKEN_KEY = 'auth-token'

  constructor(private readonly eventService: EventService) { }

  //Guardar el token cuando se registre un usuario
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
    const decodificar: any = jwtDecode(token);
    this.eventService.setNewRoles(decodificar.rol)
  }

  //Obtener el token para ver el usuario o el rol del usuario
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  //Eliminar el token al hacer logout
  removeToken(): void {
    return localStorage.removeItem(this.TOKEN_KEY)
  }

  //Boolean para ver si el usuario está logueado
  isAuthenticated(): boolean{
    return this.getToken() ? true : false;
  }

  //Obtener el id del usuario desde el token
  getIdUsuarioToken(): string | null {
    const token = this.getToken();
    if(token){
      const decodificar: any = jwtDecode(token);
      return decodificar.id;
    }
    return null;
  }

  //Obtener el rol de la persona
  getRolUsuarioToken(): Observable<any> {
    const token = this.getToken();
    if(token){
      const decodificar: any = jwtDecode(token);
      return of(decodificar.rol);
    }
    return null;
  }

}
