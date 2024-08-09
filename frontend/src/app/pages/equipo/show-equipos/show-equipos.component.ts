import { Component, OnInit } from '@angular/core';
import { Equipo } from 'src/app/models/equipo.model';
import { CrudEquiposService } from 'src/app/services/crud-equipos.service';


declare var bootstrap: any;

@Component({
  selector: 'app-show-equipos',
  templateUrl: './show-equipos.component.html',
  styleUrls: ['./show-equipos.component.css']
})
export class ShowEquiposComponent implements OnInit{

  constructor(private crudEquiposService: CrudEquiposService){}

  equipos: Equipo[]
  selectedEquipo: Equipo | null = null;

  ngOnInit(): void {
    this.crudEquiposService.getEquiposOrdenados().subscribe((res: Equipo[]) => {
      this.equipos = res
      console.log(this.equipos);
      
    })
  }

  openModal(equipo: Equipo): void {
    this.selectedEquipo = equipo
    const modalElement = document.getElementById('equipoModal')
    const modal = new bootstrap.Modal(modalElement)
    modal.show()
  }
}
