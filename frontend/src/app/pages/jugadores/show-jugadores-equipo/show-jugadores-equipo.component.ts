import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/models/jugador.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';

@Component({
  selector: 'app-show-jugadores-equipo',
  templateUrl: './show-jugadores-equipo.component.html',
  styleUrls: ['./show-jugadores-equipo.component.css']
})
export class ShowJugadoresEquipoComponent implements OnInit{

  constructor(
    private crudJugadoresService: CrudJugadoresService,
    private router: Router,
    private activatedRoute: ActivatedRoute 
  ){}

  jugadores: Jugador[]
  idApi: number
  
  ngOnInit(): void {
     this.idApi = +this.activatedRoute.snapshot.paramMap.get('idApi');
     this.crudJugadoresService.getJugadoresByIdApi(this.idApi).subscribe((data: any[]) => {
      this.jugadores = data
      console.log("Jugadores:",this.jugadores);
      
     })

  }

}
