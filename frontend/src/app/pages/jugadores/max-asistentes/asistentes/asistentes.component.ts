import { Component, OnInit } from '@angular/core';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';

@Component({
  selector: 'app-asistentes',
  templateUrl: './asistentes.component.html',
  styleUrls: ['./asistentes.component.css']
})
export class AsistentesComponent implements OnInit{

  asistentes: any[]
  jornadaNoDisputada: boolean = false
  constructor(private readonly crudJugadoresService: CrudJugadoresService){}

  ngOnInit(): void {
    this.cargarTablaAsistentes();
  }
  cargarTablaAsistentes() {
    this.crudJugadoresService.getMaximosAsistentes().subscribe({
      next: (data) => {
        this.asistentes = data.tabla;
        this.jornadaNoDisputada = false;
        console.log(this.asistentes);
        
      },
      error: (err) => {
        if(err.status === 404) {
          this.jornadaNoDisputada = true;
          console.log(err);        
        }        
      }
    })
  }
}
