import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/models/jugador.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Entrenador } from 'src/app/models/entrenador.model';

@Component({
  selector: 'app-show-jugadores-equipo',
  templateUrl: './show-jugadores-equipo.component.html',
  styleUrls: ['./show-jugadores-equipo.component.css']
})
export class ShowJugadoresEquipoComponent implements OnInit{

  faBackWard = faArrowLeft

  constructor(
    private crudJugadoresService: CrudJugadoresService,
    private router: Router,
    private activatedRoute: ActivatedRoute 
  ){}

  jugadores: Jugador[]
  idApi: number
  entrenador: Entrenador
  
  ngOnInit(): void {
     this.idApi = +this.activatedRoute.snapshot.paramMap.get('idApi');
     this.crudJugadoresService.getJugadoresByIdApi(this.idApi).subscribe((data: any) => {
      //console.log(data);
      
      this.jugadores = data.jugadores;
      console.log("Jugadores:",this.jugadores);
      this.entrenador = data.entrenador
      console.log("Entrenaodr:",this.entrenador);
      
      
     })

  }

}
