import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/models/jugador.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Entrenador } from 'src/app/models/entrenador.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-jugadores-equipo',
  templateUrl: './show-jugadores-equipo.component.html',
  styleUrls: ['./show-jugadores-equipo.component.css']
})
export class ShowJugadoresEquipoComponent implements OnInit{

  faBackWard = faArrowLeft
  faLupa = faSearch

  constructor(
    private crudJugadoresService: CrudJugadoresService,
    private router: Router,
    private activatedRoute: ActivatedRoute 
  ){}

  jugadores: Jugador[]
  idApi: number
  entrenador: Entrenador | undefined
  terminoBusqueda = ''
  
  ngOnInit(): void {
     this.idApi = +this.activatedRoute.snapshot.paramMap.get('idApi');
     this.crudJugadoresService.getJugadoresByIdApi(this.idApi).subscribe((data: any) => {
      //console.log(data);
      console.log(data);
      
      this.jugadores = data.jugadores;
      console.log("Jugadores:",this.jugadores);
      if(data.entrenador && data.entrenador.length > 0){
        this.entrenador = data.entrenador[0]
        console.log("Entrenador:",this.entrenador);
      }
      
      
     })

  }
  get jugadoresFiltrados() {
    if (this.terminoBusqueda === '') {
      return this.jugadores;
    } else {
      return this.jugadores.filter(jugador => jugador.datos.nombreJugador.toLowerCase().includes(this.terminoBusqueda.toLowerCase()));
    }
  }

}
