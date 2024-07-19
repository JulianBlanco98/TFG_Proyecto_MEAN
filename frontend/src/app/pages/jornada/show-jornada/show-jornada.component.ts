import { Component, Input, OnInit } from '@angular/core';
import { Jornada } from 'src/app/models/jornada.model';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import {
  faLongArrowLeft,
  faLongArrowRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-jornada',
  templateUrl: './show-jornada.component.html',
  styleUrls: ['./show-jornada.component.css'],
})
export class ShowJornadaComponent implements OnInit {
  @Input() numJornada: number;
  jornada: Jornada;

  faLeft = faLongArrowLeft;
  faRight = faLongArrowRight;

  constructor(private crudJornadaService: CrudJornadaService) {}

  ngOnInit(): void {
    this.getJornada();
  }
  getJornada() {
    this.crudJornadaService.getJornadaByNumero(this.numJornada).subscribe({
      next: (data) => {
        this.jornada = data;
        console.log(this.jornada);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  nuevaJornada(jornadaNueva: number) {
    this.crudJornadaService.getJornadaByNumero(jornadaNueva).subscribe(
      (data) => {
        this.jornada = data;
        console.log(this.jornada);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
