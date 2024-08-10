import { Component, OnInit } from '@angular/core';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';

@Component({
  selector: 'app-asistentes',
  templateUrl: './asistentes.component.html',
  styleUrls: ['./asistentes.component.css']
})
export class AsistentesComponent implements OnInit{

  asistentes: any[]
  constructor(private readonly crudJugadoresService: CrudJugadoresService){}

  ngOnInit(): void {
    this.cargarTablaAsistentes();
  }
  cargarTablaAsistentes() {
    this.crudJugadoresService.getMaximosAsistentes().subscribe({
      next: (data) => {
        this.asistentes = data.tabla;
        console.log(this.asistentes);
        
      },
      error: (err) => {
        console.log(err);        
      }
    })
  }
}
