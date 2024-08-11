import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { faRankingStar, faBookBookmark, faSoccerBall, faSocks } from '@fortawesome/free-solid-svg-icons';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';

@Component({
  selector: 'app-tab-clasificacion',
  templateUrl: './tab-clasificacion.component.html',
  styleUrls: ['./tab-clasificacion.component.css']
})
export class TabClasificacionComponent implements AfterViewInit {

  
  @Output() numeroJornadaChange = new EventEmitter<number>();

  numeroJornada: number;
  activeTab: string = 'clasificacion';  // Tab por defecto

  faTabla = faRankingStar;
  faJornada = faBookBookmark;
  faGoleador = faSoccerBall;
  faAsistente = faSocks;

  constructor(private readonly crudJornadaService: CrudJornadaService) {}

  ngAfterViewInit() {
    this.getNumeroJornadaActual();
  }

  getNumeroJornadaActual(){
    this.crudJornadaService.getNumeroJornadaActual().subscribe({
      next: (data) => {
        this.numeroJornada = data.numeroJornadaActual;
        //console.log("Numero jornada actual: ", this.numeroJornada);
      },
      error: (err) => {
        console.log(err);        
      }
    });
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }
}
