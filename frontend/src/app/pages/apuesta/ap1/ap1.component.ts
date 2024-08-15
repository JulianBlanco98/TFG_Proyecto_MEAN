import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Jornada } from 'src/app/models/jornada.model';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { GetClasificacionService } from 'src/app/services/get-clasificacion.service';
import { CrudPrediccionService } from 'src/app/services/crud-prediccion.service';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

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
  editarBoton: boolean = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly crudJornadaService: CrudJornadaService,
    private readonly clasificacionService: GetClasificacionService,
    private readonly crudPrediccionService: CrudPrediccionService,
    private readonly alertifyService: AlertifyService,
    private readonly router: Router,
    private readonly eventService: EventService,
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
        this.getPrediccionActual();
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

  getPrediccionActual() {
    this.crudPrediccionService.getPrediByJornada(this.numJornada).subscribe({
      next: (data:any) => {
        console.log("predi1 actual: ",data); 
        
        //Si tiene contenido, es decir, ya hay una predi del usuario en ensta jornada
        if(data && data.tipo_1) {

          this.editarBoton= true;
          data.tipo_1.forEach((predi: any) => {
            const partidoIndice = predi.indicePartido;
            this.selectedButton[partidoIndice] = predi.prediGanador;
            this.predicciones.at(partidoIndice).get('prediccion').setValue(predi.prediGanador);
            this.predicciones.at(partidoIndice).get('cantidad').setValue(predi.cantidad);
            this.predicciones.at(partidoIndice).get('multi').setValue(predi.multiPrediccion);           
          })
        }
      },
      error: (err) => {
        // console.log(err);
        if(err.status === 404){
          this.editarBoton = false;
        }
      },
    })
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
        this.eventService.notifyMonedasActualizadas();
        //this.router.navigateByUrl('/apuesta');
        this.alertifyService.success(response.message);
        this.getPrediccionActual();
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

  onUpdate() {
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
  
    this.crudPrediccionService.actualizarPredi(this.numJornada, data).subscribe({
      next: (response) => {
        console.log('Predicciones actualizadas:', response);
        this.eventService.notifyMonedasActualizadas();
        this.alertifyService.success(response.message);
        this.getPrediccionActual();
      },
      error: (err) => {
        console.log('Error al actualizar predicciones:', err);
        if (err.status === 400) {
          console.log('mensaje de error del backend: ', err.error.message);
          this.alertifyService.warning(err.error.message);
        }
      },
    });
  }
  

  resetearFormulario() {

    console.log("Botoón de reset. Jornada: ",this.numJornada);

    //hacer llamada de delte prediccion
    this.crudPrediccionService.deletePredi(this.numJornada).subscribe({
      next: (response) => {
        
        this.alertifyService.success(response.message);
        this.predicciones.controls.forEach((control, index) => {
          control.reset({ cantidad: 0, prediccion: '', multi: '' }); // Resetea cada control
          delete this.selectedButton[index]; // Resetea los botones
        });
        this.editarBoton = false;
        this.eventService.notifyMonedasActualizadas();
      },
      error: (err) => {
        this.alertifyService.warning(err.error.message);
      }
    })

  }
}
