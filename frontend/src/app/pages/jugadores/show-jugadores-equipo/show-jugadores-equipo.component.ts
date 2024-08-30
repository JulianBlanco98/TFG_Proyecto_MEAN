import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/models/jugador.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Entrenador } from 'src/app/models/entrenador.model';
import { FormsModule } from '@angular/forms';
import { Equipo } from 'src/app/models/equipo.model';

@Component({
  selector: 'app-show-jugadores-equipo',
  templateUrl: './show-jugadores-equipo.component.html',
  styleUrls: ['./show-jugadores-equipo.component.css'],
})
export class ShowJugadoresEquipoComponent implements OnInit {
  faBackWard = faArrowLeft;
  faLupa = faSearch;

  constructor(
    private crudJugadoresService: CrudJugadoresService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  jugadores: Jugador[];
  idApi: number;
  entrenador: Entrenador | undefined;
  terminoBusqueda = '';
  posicionSeleccionada = 'Todos';
  equipo: Equipo | undefined;

  ngOnInit(): void {
    this.idApi = +this.activatedRoute.snapshot.paramMap.get('idApi');
    this.cargarJugadores(this.idApi);
  }

  cargarJugadores(idApi: number) {
    this.crudJugadoresService
      .getJugadoresByIdApi(idApi)
      .subscribe((data: any) => {
        console.log(data);
        // console.log(data);
        data.jugadores.filter((jug: { frente: boolean; }) => jug.frente = true);
        this.jugadores = data.jugadores;

        //console.log('Jugadores:', this.jugadores);
        if (data.entrenador && data.entrenador.length > 0) {
          this.entrenador = data.entrenador[0];
          //console.log('Entrenador:', this.entrenador);
        }
        this.equipo = data.equipo;
      });
  }
  cargarJugadoresPosicion(idApi: number, tipo: string) {
    this.crudJugadoresService.getJugadoresByPosicion(idApi, tipo).subscribe((data: any) => {
      console.log(data);
      data.jugadores.filter((jug: { frente: boolean; }) => jug.frente = true);
      this.jugadores = data.jugadores;
      if (data.entrenador && data.entrenador.length > 0) {
        this.entrenador = data.entrenador[0];
      }
      this.equipo = data.equipo;
    });
  }


  getEstadisticasByJugador(jugador: Jugador) {

    jugador.frente = !jugador.frente;
    
    
  }
  seleccionarPosicion(event: Event): void {

    this.posicionSeleccionada = (event.target as HTMLInputElement).value;
    //console.log("Posicion seleecioanda: ",this.posicionSeleccionada);
    
    if(this.posicionSeleccionada === 'Todos'){
      this.cargarJugadores(this.idApi)
    }
    else{
      this.cargarJugadoresPosicion(this.idApi, this.posicionSeleccionada);
    }
  }

  get jugadoresFiltrados() {
    if (this.terminoBusqueda === '') {
      return this.jugadores;
    } else {
      return this.jugadores.filter((jugador) =>
        jugador.datos.nombreJugador
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }
}
