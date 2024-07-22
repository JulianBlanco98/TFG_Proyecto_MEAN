import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AlertifyService } from 'src/app/services/alertify.service';

declare var bootstrap: any;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  usuario: User;
  message: string;
  toastTipo: string;

  constructor(
    private router: Router,
    private crudUsersService: CrudUsersService,
    private alertifyService: AlertifyService
  ) {
    this.usuario = {
      _id: '',
      datos: {
        nombre: '',
        edad: null,
        correo: '',
        password: '',
      },
      moneda: null,
      rol: '',
    };
  }

  onRegister() {
    this.crudUsersService.registro(this.usuario).subscribe({
      next: (data) => {
        this.message = data.message;
        this.toastTipo = data.type;
        console.log('Usuario registrado con exito', data);

        // Ocultar el modal
        const modal = document.getElementById('registroModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);

        console.log("Modal antes de cerrarse: ",bootstrapModal);
        
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
        // Remover manualmente la clase 'modal-open' del body y el backdrop
        setTimeout(() => {
          document.body.classList.remove('modal-open');
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach((backdrop) => backdrop.remove());

          document.body.style.overflow = 'auto';
                document.body.style.position = 'static';
        }, 300); // Esperar un pequeño tiempo para asegurar que el DOM está listo
        console.log("Modal despues de cerrarse: ",bootstrapModal);
        
        //Reseteo el formulario
        this.usuario = {
          _id: '',
          datos: {
            nombre: '',
            edad: null,
            correo: '',
            password: '',
          },
          moneda: null,
          rol: '',
        };

        this.alertifyService.success(this.message);
      },
      error: (err) => {
        console.log('Error al registrar el usuario', err);
        this.message = 'Error al registrar el usuario';
        this.toastTipo = 'danger';
      },
    });
  }
}
