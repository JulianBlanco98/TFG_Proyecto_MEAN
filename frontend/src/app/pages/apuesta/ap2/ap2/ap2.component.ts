import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Jornada } from 'src/app/models/jornada.model';
import { Equipo } from 'src/app/models/equipo.model';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { CrudEquiposService } from 'src/app/services/crud-equipos.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { faCoins, faFutbol } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-ap2',
  templateUrl: './ap2.component.html',
  styleUrls: ['./ap2.component.css']
})
export class Ap2Component implements OnInit{

  equipos: Equipo[] = [];
  jornada: Jornada;
  numJornada: number
  filas: any[] = [];
  faMoneda = faCoins;
  faGoles = faFutbol;

  golesPrediForm: FormGroup;

  constructor(
    private readonly eventService: EventService,
    private readonly alertifyService: AlertifyService,
    private readonly crudJornadaService: CrudJornadaService,
    private readonly crudEquipoService: CrudEquiposService,
    private readonly sanitizer: DomSanitizer,
    private readonly fb: FormBuilder,

  ) {}

  

  ngOnInit(): void {
    this.getEquipos();
  }
  addFilas() {
    this.filas.push({});
  }
  removeFilas(index: number) {
    this.filas.splice(index, 1);
  }

  getEquipos() {
    this.crudEquipoService.getEquiposOrdenados().subscribe({
      next: (data: any) => {
        this.equipos = data;
        console.log(this.equipos);
        
      },
      error: (err) => {
        console.log(err.error.message);        
      },
    })
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 1 ? []
        : this.equipos.filter(v => v.nombreEquipo.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
      )
    );

  inputFormatter = (x: { nombreEquipo: string }) => x.nombreEquipo;

}
