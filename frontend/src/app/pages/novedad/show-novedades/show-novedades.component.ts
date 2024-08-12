import { Component, OnInit } from '@angular/core';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';

@Component({
  selector: 'app-show-novedades',
  templateUrl: './show-novedades.component.html',
  styleUrls: ['./show-novedades.component.css']
})
export class ShowNovedadesComponent implements OnInit{

  numJornada: number
  goleador: {
    datos: {
      nombreJugador: string,
      posicion: string,
      imagenJugador: string,
    },
    goles: number
  }
  asistente: {
    datos: {
      nombreJugador: string,
      posicion: string,
      imagenJugador: string,
    },
    asistencias: number
  }
  equipoG: {
    nombreEquipo: string,
    escudoEquipo: string,
    goles: number
  }

  constructor(
    private readonly crudJornadaService: CrudJornadaService
  ) {}

  ngOnInit(): void {
    this.getNumeroJornadaActual();
    this.getGoleadorJornada();
    this.getAsistenteJornada();
    this.getEquipoJornada();
  }

  getNumeroJornadaActual() {
    this.crudJornadaService.getNumeroJornadaNovedad().subscribe({
      next: (data: any) => {
        this.numJornada = data.numeroJornadaActual;
        //console.log("Jornada actual: ",this.numJornada);
        
      },
      error: (err: any) => {
        console.error('Error al obtener la jornada', err);
      },
    })
  }

  getGoleadorJornada() {
    this.crudJornadaService.getGoleadorJornadaActual().subscribe({
      next: (data: any) => {
        this.goleador = {
          datos: {
            nombreJugador: data.goleador.datos.nombreJugador,
            posicion: data.goleador.datos.posicion,
            imagenJugador: data.goleador.datos.imagenJugador
          },
          goles: data.goles
        }       
      },
      error: (err: any) => {
        console.log("Error al obtener el goleador: ", err);
      }
    })
  }
  getAsistenteJornada() {
    this.crudJornadaService.getAsistenteJornadaActual().subscribe({
      next: (data: any) => {
        this.asistente = {
          datos: {
            nombreJugador: data.asistente.datos.nombreJugador,
            posicion: data.asistente.datos.posicion,
            imagenJugador: data.asistente.datos.imagenJugador
          },
          asistencias: data.asistencias
        }
      },
      error: (err: any) => {
        console.log("Error al obtener el asistente: ", err);
      }
    })
  }

  getEquipoJornada() {
    this.crudJornadaService.getEquipoJornadaActual().subscribe({
      next: (data: any) => {
        this.equipoG = {
          nombreEquipo: data.equipo.nombreEquipo,
          escudoEquipo: data.equipo.escudoEquipo,
          goles: data.goles
        }
      },
      error: (err: any) => {
        console.log("Error al obtener el equipo: ", err);
      }
    })
  }




}
