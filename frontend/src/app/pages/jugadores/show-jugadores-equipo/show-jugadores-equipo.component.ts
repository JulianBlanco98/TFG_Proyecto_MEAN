import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/models/jugador.model';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';

@Component({
  selector: 'app-show-jugadores-equipo',
  templateUrl: './show-jugadores-equipo.component.html',
  styleUrls: ['./show-jugadores-equipo.component.css']
})
export class ShowJugadoresEquipoComponent implements OnInit{

  constructor(private crudJugadoresService: CrudJugadoresService){}

  jugadores: Jugador[]
  
  ngOnInit(): void {
     
  }

}
