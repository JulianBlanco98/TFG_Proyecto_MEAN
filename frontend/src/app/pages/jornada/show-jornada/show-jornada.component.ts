import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Jornada } from 'src/app/models/jornada.model';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import {
  faLongArrowLeft,
  faLongArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowPartidoComponent } from '../../partido/show-partido/show-partido.component';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-show-jornada',
  templateUrl: './show-jornada.component.html',
  styleUrls: ['./show-jornada.component.css'],
})
export class ShowJornadaComponent implements OnChanges {
  @Input() numJornada: number;
  jornada: Jornada;
  jornadaActual: number;

  faLeft = faLongArrowLeft;
  faRight = faLongArrowRight;

  constructor(
    private readonly crudJornadaService: CrudJornadaService,
    private readonly modalService: NgbModal,
    private readonly alertifyService: AlertifyService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numJornada'] && changes['numJornada'].currentValue) {
      this.getJornada();
    }
  }

  getJornada() {
    if (this.numJornada) {
      this.crudJornadaService.getJornadaByNumero(this.numJornada).subscribe({
        next: (data) => {
          this.jornada = data;
          this.jornadaActual = this.jornada.numeroJornada;
          console.log(this.jornada);
          console.log("Jornada actual: ", this.jornadaActual);
          
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  nuevaJornada(jornadaNueva: number) {
    this.crudJornadaService.getJornadaByNumero(jornadaNueva).subscribe({
      next: (data) => {
        this.jornada = data;
        console.log(this.jornada);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openModal(nJornada: number, nPartido: number) {

    if(nJornada < this.jornadaActual){

      const modal = this.modalService.open(ShowPartidoComponent, {
        centered: true,
        backdrop: true,
        size: 'xl'
      }); 
      
      modal.componentInstance.nJornada = nJornada
      modal.componentInstance.nPartido = nPartido
    }
    else{
      this.alertifyService.warning('Esta jornada todavía no se ha jugado');
    }
    //console.log("Pinchar para el modal: Jornada ", nJornada, " Partido: ",nPartido);

  }
}
