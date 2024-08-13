import { Component, OnInit } from '@angular/core';
import { Jornada } from 'src/app/models/jornada.model';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
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

  constructor(private readonly crudJornadaService: CrudJornadaService) {
  }
  
  ngOnInit(): void {
    this.getNumeroJornadaActual();
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

  selectButton(index: number, option: string) {
    if(this.selectedButton[index] === option){
      delete this.selectedButton[index];
    }
    else{
      this.selectedButton[index] = option;
    }
  }
}
