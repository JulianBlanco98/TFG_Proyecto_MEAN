import { Component, OnInit } from '@angular/core';
import { Jornada } from 'src/app/models/jornada.model';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { GetClasificacionService } from 'src/app/services/get-clasificacion.service';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ap1',
  templateUrl: './ap1.component.html',
  styleUrls: ['./ap1.component.css'],
})
export class Ap1Component implements OnInit{
  jornada: Jornada;
  numJornada: number;
  selectedButton: { [key: number]: string } = {};
  faMoneda = faCoins;
  multis: [{
    equipo: string,
    multi: string
  }]

  constructor(
    private readonly crudJornadaService: CrudJornadaService,
    private readonly clasificacionService: GetClasificacionService
  ) {
  }
  
  ngOnInit(): void {
    this.getNumeroJornadaActual();
    this.getMultis();
  }

  getJornada() {
    this.crudJornadaService.getJornadaByNumero(this.numJornada).subscribe({
      next: (data) => {
        this.jornada = data;
        console.log(this.jornada);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getNumeroJornadaActual() {
    this.crudJornadaService.getNumeroJornadaActual().subscribe({
      next: (data) => {
        this.numJornada = data.numeroJornadaActual;
        console.log("Jornada actual apuesta: ",this.numJornada);
        this.getJornada();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getMultis() {
    this.clasificacionService.getMultiPrediccion1().subscribe({
      next: (data) => {
        this.multis = data.tabla;
        console.log(this.multis);
        
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getMultiByEquipo(idEquipo: string): string {
    const multiplicador = this.multis.find(m => m.equipo === idEquipo);
    return multiplicador ? multiplicador.multi : '';
  }

  selectButton(index: number, option: string) {
    if(this.selectedButton[index] === option){
      delete this.selectedButton[index];
    }
    else{
      this.selectedButton[index] = option;
    }
  }
}
