import { Component, OnInit } from '@angular/core';
import { Equipo } from 'src/app/models/equipo.model';
import { CrudEquiposService } from 'src/app/services/crud-equipos.service';

@Component({
  selector: 'app-show-equipos',
  templateUrl: './show-equipos.component.html',
  styleUrls: ['./show-equipos.component.css']
})
export class ShowEquiposComponent implements OnInit{

  constructor(private crudEquiposService: CrudEquiposService){}
  equipos: Equipo[]

  ngOnInit(): void {
    this.crudEquiposService.getEquiposOrdenados().subscribe((res: Equipo[]) => {
      this.equipos = res
    })
  }

}
