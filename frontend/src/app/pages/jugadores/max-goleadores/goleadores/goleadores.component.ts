import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/models/jugador.model';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';

@Component({
  selector: 'app-goleadores',
  templateUrl: './goleadores.component.html',
  styleUrls: ['./goleadores.component.css']
})
export class GoleadoresComponent implements OnInit{

  constructor(private readonly crudJugadoresService: CrudJugadoresService){}
  goleadores: Jugador[]

  ngOnInit(): void {
    this.cargarTablaGoleadores();
  }
  cargarTablaGoleadores(){
    this.crudJugadoresService.getMaximosGoleadores().subscribe({
      next: (data) => {
        this.goleadores = data.tabla;
      },
      error: (err) => {
        console.log(err);        
      }
    })
  }

}
