import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { Partido } from 'src/app/models/partido.model';
import { faFutbol, faSocks } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-partido',
  templateUrl: './show-partido.component.html',
  styleUrls: ['./show-partido.component.css']
})
export class ShowPartidoComponent implements OnInit{

  @Input() nJornada: number
  @Input() nPartido: number

  faGoles = faFutbol;
  faAsistencias = faSocks;

  partido: Partido
  goleadoresLocales: { nombreJugador: string, goles: number }[] = [];
  asistentesLocales: { nombreJugador: string, asistencias: number }[] = [];
  goleadoresVisitantes: { nombreJugador: string, goles: number }[] = [];
  asistentesVisitantes: { nombreJugador: string, asistencias: number }[] = [];

  constructor(
    public readonly modal: NgbActiveModal,
    private readonly crudJornadaService: CrudJornadaService
  ) {}

  ngOnInit(): void {
    this.getPartido();
  }

  getPartido(){
    console.log("En el modal jornada: ",this.nJornada, " partido: ", this.nPartido);
    
    this.crudJornadaService.getPartido(this.nJornada, this.nPartido).subscribe({
      next: (data) => {
        this.partido = data;
        console.log(this.partido);
        this.getGoleadoresYAsistentes(this.partido);
        // console.log("Goleadores: ",this.goleadoresLocales);
        // console.log("Asistentes: ",this.asistentesVisitantes);
        
        
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }

  getGoleadoresYAsistentes(partido: Partido){
    partido.titularesLocal.forEach(jugador => {
      if(jugador.goles !== 0){
        this.goleadoresLocales.push({
          nombreJugador: jugador.jugador,
          goles: jugador.goles
        })
      }
      if(jugador.asistencias !== 0){
        this.asistentesLocales.push({
          nombreJugador: jugador.jugador,
          asistencias: jugador.asistencias
        })
      }
    });
    partido.titularesVisitante.forEach(jugador => {
      if(jugador.goles !== 0){
        this.goleadoresVisitantes.push({
          nombreJugador: jugador.jugador,
          goles: jugador.goles
        })
      }
      if(jugador.asistencias !== 0){
        this.asistentesVisitantes.push({
          nombreJugador: jugador.jugador,
          asistencias: jugador.asistencias
        })
      }
    });
  }

}
