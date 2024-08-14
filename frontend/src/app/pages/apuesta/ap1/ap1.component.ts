import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Jornada } from 'src/app/models/jornada.model';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { GetClasificacionService } from 'src/app/services/get-clasificacion.service';
import { CrudPrediccionService } from 'src/app/services/crud-prediccion.service';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-ap1',
  templateUrl: './ap1.component.html',
  styleUrls: ['./ap1.component.css'],
})
export class Ap1Component implements OnInit {
  jornada: Jornada;
  numJornada: number;
  faMoneda = faCoins;
  multis: [{ equipo: string; multi: string }];
  prediccionesForm: FormGroup;
  selectedButton: { [key: number]: string } = {};

  constructor(
    private readonly fb: FormBuilder,
    private readonly crudJornadaService: CrudJornadaService,
    private readonly clasificacionService: GetClasificacionService,
    private readonly crudPrediccionService: CrudPrediccionService,
    private readonly alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.prediccionesForm = this.fb.group({
      predicciones: this.fb.array([]),
    });

    this.getNumeroJornadaActual();
    this.getMultis();
  }

  get predicciones() {
    return this.prediccionesForm.get('predicciones') as FormArray;
  }

  getJornada() {
    this.crudJornadaService.getJornadaByNumero(this.numJornada).subscribe({
      next: (data) => {
        this.jornada = data;
        this.jornada.partidos.forEach(() => {
          this.predicciones.push(
            this.fb.group({
              prediccion: [''],
              cantidad: [0],
              multi: [''],
            })
          );
        });
        console.log(this.jornada);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getNumeroJornadaActual() {
    this.crudJornadaService.getNumeroJornadaActual().subscribe({
      next: (data) => {
        this.numJornada = data.numeroJornadaActual;
        console.log('Jornada actual apuesta: ', this.numJornada);
        this.getJornada();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getMultis() {
    this.clasificacionService.getMultiPrediccion1().subscribe({
      next: (data) => {
        this.multis = data.tabla;
        console.log(this.multis);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getMultiByEquipo(idEquipo: string): string {
    const multiplicador = this.multis.find((m) => m.equipo === idEquipo);
    return multiplicador ? multiplicador.multi : '';
  }

  selectButton(index: number, option: string) {
    let multi = '';

    if (option === 'empate') {
      const equipoLocalId = this.jornada.partidos[index].equipoLocal._id;
      const equipoVisitanteId =
        this.jornada.partidos[index].equipoVisitante._id;

      const multiLocal = parseFloat(this.getMultiByEquipo(equipoLocalId));
      const multiVisitante = parseFloat(
        this.getMultiByEquipo(equipoVisitanteId)
      );

      multi = ((multiLocal + multiVisitante) / 2).toFixed(2); // Calcula la media y la formatea a dos decimales
    } else if (option === 'local') {
      const equipoLocalId = this.jornada.partidos[index].equipoLocal._id;
      multi = this.getMultiByEquipo(equipoLocalId);
    } else if (option === 'visitante') {
      const equipoVisitanteId =
        this.jornada.partidos[index].equipoVisitante._id;
      multi = this.getMultiByEquipo(equipoVisitanteId);
    }

    if (this.selectedButton[index] === option) {
      delete this.selectedButton[index];
      this.predicciones.at(index).get('prediccion').setValue('');
      this.predicciones.at(index).get('multi').setValue(''); // Desmarca el multi en el formulario
    } else {
      this.selectedButton[index] = option;
      this.predicciones.at(index).get('prediccion').setValue(option);
      this.predicciones.at(index).get('multi').setValue(multi); // Establece el multi en el formulario
    }
  }

  getCantidadControl(index: number): FormControl {
    return this.predicciones.at(index).get('cantidad') as FormControl;
  }

  onSubmit() {
    const data = this.predicciones.controls.map((control, index) => {
      return {
        indicePartido: index,
        equipoLocal: this.jornada.partidos[index].equipoLocal._id,
        equipoVisitante: this.jornada.partidos[index].equipoVisitante._id,
        prediccion: control.get('prediccion').value,
        cantidad: control.get('cantidad').value,
        multi: control.get('multi').value,
      };
    });

    this.crudPrediccionService.crearPredi(this.numJornada, data).subscribe({
      next: (response) => {
        console.log('Predicciones guardadas:', response);
        this.alertifyService.success(response.message);
      },
      error: (err) => {
        console.log('Error al guardar predicciones:', err);
        if (err.status === 400) {
          console.log('mensaje de error del backend: ', err.error.message);
          if (err.error.message.includes('No tienes')) {
            this.alertifyService.warning(err.error.message);
          }
          else if(err.error.message.includes('No has usado')){
            this.alertifyService.warning(err.error.message);
          }
          else if(err.error.message.includes('ninguna predi')){
            this.alertifyService.warning(err.error.message);
          }
        }
      },
    });
  }

  resetearFormulario() {
    this.predicciones.controls.forEach((control, index) => {
      control.reset({ cantidad: 0, prediccion: '', multi: '' }); // Resetea cada control
      delete this.selectedButton[index]; // Resetea los botones
    });
  }
}
