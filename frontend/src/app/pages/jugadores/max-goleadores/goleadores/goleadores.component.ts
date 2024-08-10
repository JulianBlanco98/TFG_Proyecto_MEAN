import { Component, OnInit } from '@angular/core';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';

@Component({
  selector: 'app-goleadores',
  templateUrl: './goleadores.component.html',
  styleUrls: ['./goleadores.component.css']
})
export class GoleadoresComponent implements OnInit{

  goleadores: any []
  constructor(private readonly crudJugadoresService: CrudJugadoresService){}

  ngOnInit(): void {
    this.cargarTablaGoleadores();
  }
  cargarTablaGoleadores(){
    this.crudJugadoresService.getMaximosGoleadores().subscribe({
      next: (data) => {
        this.goleadores = data.tabla;
        console.log(this.goleadores);
        
      },
      error: (err) => {
        console.log(err);        
      }
    })
  }

}
