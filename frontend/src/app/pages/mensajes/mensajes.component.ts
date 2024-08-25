import { Component, OnInit } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Mensaje } from 'src/app/models/mensaje.model';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit{

  mensajes: Mensaje [] = []
  faUsuarios = faCircleUser;

  hayMensajes: boolean = false;
  constructor(
    private readonly mensajesService: MensajesService
  ) {}

  ngOnInit(): void {
    this.getMensajes();
  }

  getMensajes() {
    this.mensajesService.getMensajes().subscribe((res: any) => {
      // Accede a la propiedad `mensajes` dentro de la respuesta
      if (res && res.mensajes && Array.isArray(res.mensajes)) {
        this.mensajes = res.mensajes;
        this.hayMensajes = this.mensajes.length > 0;
      } else {
        this.mensajes = [];
        this.hayMensajes = false;
      }
      console.log(this.mensajes); // Para verificar los mensajes en la consola
    });
  }
  

}
