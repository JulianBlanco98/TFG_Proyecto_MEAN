import { Component, OnInit } from '@angular/core';
import { CrudJugadoresService } from 'src/app/services/crud-jugadores.service';

@Component({
  selector: 'app-goleadores',
  templateUrl: './goleadores.component.html',
  styleUrls: ['./goleadores.component.css']
})
export class GoleadoresComponent implements OnInit{

  goleadores: any []
  jornadaNoDisputada: boolean = false
  constructor(private readonly crudJugadoresService: CrudJugadoresService){}

  ngOnInit(): void {
    this.cargarTablaGoleadores();
  }
  cargarTablaGoleadores(){
    this.crudJugadoresService.getMaximosGoleadores().subscribe({
      next: (data) => {
        this.goleadores = data.tabla;
        this.jornadaNoDisputada = false;
        console.log(this.goleadores);
        
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
