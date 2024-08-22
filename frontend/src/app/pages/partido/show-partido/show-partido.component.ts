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

  partido: Partido;
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
        // console.log(data);
        this.partido = data.alineacion;
        console.log(this.partido);
        this.goleadoresLocales = data.estadisticas.goleadoresLocales;
        this.goleadoresVisitantes = data.estadisticas.goleadoresVisitantes;
        this.asistentesLocales = data.estadisticas.asistentesLocales;
        this.asistentesVisitantes = data.estadisticas.asistentesVisitantes;
        // this.getGoleadoresYAsistentes(this.partido);
        // console.log("Goleadores: ",this.goleadoresLocales);
        // console.log("Asistentes: ",this.asistentesVisitantes);
        
        
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }
}
