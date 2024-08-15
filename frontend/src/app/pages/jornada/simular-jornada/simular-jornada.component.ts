import { Component } from '@angular/core';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { CalendarioService } from 'src/app/services/calendario.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-simular-jornada',
  templateUrl: './simular-jornada.component.html',
  styleUrls: ['./simular-jornada.component.css']
})
export class SimularJornadaComponent {

  jornadaActual: number
  
  constructor(
    private readonly crudJornadaService: CrudJornadaService,
    private readonly alertifyService: AlertifyService,
    private readonly calendarioService: CalendarioService
  ){
    this.getNumeroJornadaActual();
  }
  getNumeroJornadaActual() {
    this.crudJornadaService.getNumeroJornadaActual().subscribe({
      next: (response) => {
        console.log(response);
        this.jornadaActual = response.numeroJornadaActual;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  simular() {
    this.crudJornadaService.simularJornadaAdmin().subscribe({
      next: (response) => {
        console.log(response);
        this.alertifyService.success(response.message)
        this.getNumeroJornadaActual();
        //hacer aquí la llamada
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }

  resetJornadas() {
    this.calendarioService.resetearCalendario().subscribe({
      next: (response) => {
        this.getNumeroJornadaActual();
        this.alertifyService.success(response.message)
      },
      error: (err) => {
        console.log(err.error.message);
      }
    })
  }


}
