import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly TOKEN_KEY = 'auth-token'

  constructor() { }

  //Guardar el token cuando se registre un usuario
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
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

}
