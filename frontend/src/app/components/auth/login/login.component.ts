import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  nombre: string;
  edad: string;
  correo: string;
  password: string
  
  onLogin() {
    throw new Error('Method not implemented.');
  }
}
