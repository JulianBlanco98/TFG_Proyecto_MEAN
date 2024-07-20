import { Component, OnInit } from '@angular/core';
import { Clasificacion } from 'src/app/models/clasificacion.model';
import { GetClasificacionService } from 'src/app/services/get-clasificacion.service';

@Component({
  selector: 'app-show-tabla-clasificacion',
  templateUrl: './show-tabla-clasificacion.component.html',
  styleUrls: ['./show-tabla-clasificacion.component.css']
})
export class ShowTablaClasificacionComponent implements OnInit{

  constructor(private getClasificacionService: GetClasificacionService){}

  tablaClasificacion: Clasificacion

  ngOnInit(): void {
    this.getClasificacionService.getTablaClasificacion().subscribe({
      next: (data) => {
        this.tablaClasificacion = data
        console.log(this.tablaClasificacion);
        
      },
      error: (err) => {
        console.log(err);
        
      },
    });
  }

}
