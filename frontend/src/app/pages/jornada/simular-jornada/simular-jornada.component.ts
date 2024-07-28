import { Component } from '@angular/core';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
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
    private readonly alertifyService: AlertifyService
  ){
    this.crudJornadaService.getNumeroJornadaActual().subscribe({
      next: (response) => {
        console.log(response);
        this.jornadaActual = response.numeroJornadaActual;
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }
  simular() {
    this.crudJornadaService.simularJornadaAdmin().subscribe({
      next: (response) => {
        console.log(response);
        this.alertifyService.success(response.message)
        //hacer aquí la llamada
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }


}
