import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { faRankingStar, faJournalWhills, faSoccerBall, faSocks } from '@fortawesome/free-solid-svg-icons';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';

@Component({
  selector: 'app-tab-clasificacion',
  templateUrl: './tab-clasificacion.component.html',
  styleUrls: ['./tab-clasificacion.component.css']
})
export class TabClasificacionComponent implements AfterViewInit {
  
  @ViewChild('jornadaTab', { static: true }) jornadaTab: ElementRef;
  @Output() numeroJornadaChange = new EventEmitter<number>();

  numeroJornada: number;
  jornadaTabSelected = false;
  faTabla = faRankingStar;
  faJornada = faJournalWhills;
  faGoleador = faSoccerBall;
  faAsistente = faSocks;

  constructor(private readonly crudJornadaService: CrudJornadaService) {}

  ngAfterViewInit() {
    this.getNumeroJornadaActual();

    // Escuchar evento de cambio de tab
    this.jornadaTab.nativeElement.addEventListener('shown.bs.tab', () => {
      this.jornadaTabSelected = true;
      this.numeroJornadaChange.emit(this.numeroJornada);
    });
  }

  getNumeroJornadaActual(){
    this.crudJornadaService.getNumeroJornadaActual().subscribe({
      next: (data) => {
        this.numeroJornada = data.numeroJornadaActual;
        console.log("Numero jornada actual: ", this.numeroJornada);
      },
      error: (err) => {
        console.log(err);        
      }
    })
  }
}
