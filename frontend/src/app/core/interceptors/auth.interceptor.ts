import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly authServiceService: AuthServiceService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    let copiaPeticion = request;
    const token = this.authServiceService.getToken();
    //console.log("Token del interceptor: ", token);
    
    if(token){
      copiaPeticion = request.clone({
        setHeaders: {
          Authorization: token,
        }
      })
    }
    
    return next.handle(copiaPeticion);
  }
}
