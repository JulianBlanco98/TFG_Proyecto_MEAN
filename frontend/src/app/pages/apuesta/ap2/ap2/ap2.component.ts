import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Jornada } from 'src/app/models/jornada.model';
import { Equipo } from 'src/app/models/equipo.model';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { CrudEquiposService } from 'src/app/services/crud-equipos.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { faCircleMinus, faCirclePlus, faCoins, faFutbol } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CrudPrediccionService } from 'src/app/services/crud-prediccion.service';


@Component({
  selector: 'app-ap2',
  templateUrl: './ap2.component.html',
  styleUrls: ['./ap2.component.css'],
})
export class Ap2Component implements OnInit {
  equipos: Equipo[] = [];
  jornada: Jornada;
  numJornada: number;
  filas: any[] = [];
  faMoneda = faCoins;
  faGoles = faFutbol;
  faNuevo = faCirclePlus;
  faBorrar = faCircleMinus;

  golesPrediForm: FormGroup;
  editarBoton: boolean = true;

  constructor(
    private readonly eventService: EventService,
    private readonly alertifyService: AlertifyService,
    private readonly crudJornadaService: CrudJornadaService,
    private readonly crudEquipoService: CrudEquiposService,
    private readonly sanitizer: DomSanitizer,
    private readonly fb: FormBuilder,
    private readonly crudPrediccionService: CrudPrediccionService
  ) {}

  ngOnInit(): void {
    this.getEquipos();
    this.getNumeroJornadaActual();
    this.golesPrediForm = this.fb.group({
      predicciones: this.fb.array([]),
    });
  }
  get predicciones(): FormArray {
    return this.golesPrediForm.get('predicciones') as FormArray;
  }
  addFilas() {
    const prediccionForm = this.fb.group({
      equipo: ['', Validators.required], // Validación para que el equipo sea obligatorio
      goles: ['', [Validators.required, Validators.min(1), Validators.max(6)]], // Goles entre 1 y 6
      cantidad: ['', [Validators.required, Validators.min(1)]], // Cantidad positiva
    });
    this.predicciones.push(prediccionForm);
    this.filas.push({});
    
    this.golesPrediForm.setValidators(this.equipoUnicoValidator(this.predicciones));

  }
  removeFilas(index: number) {
    this.filas.splice(index, 1);
    (this.golesPrediForm.get('predicciones') as FormArray).removeAt(index);
  }
  getNumeroJornadaActual() {
    this.crudJornadaService.getNumeroJornadaActual().subscribe({
      next: (data) => {
        this.numJornada = data.numeroJornadaActual;
        // console.log('Jornada actual apuesta: ', this.numJornada);
        this.getPrediccionActual();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getEquipos() {
    this.crudEquipoService.getEquiposOrdenados().subscribe({
      next: (data: any) => {
        this.equipos = data;
        console.log(this.equipos);
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  getPrediccionActual() {
    this.crudPrediccionService.getPrediByJornada(this.numJornada).subscribe({
      next: (data: any) => {
        //Si existe la predicción y existe una de tipo_2, cargar esa predi en el formulario
        if (data && data.tipo_2) {
          this.editarBoton = true;
          this.cargarPredicciones(data.tipo_2);
        }
      },
      error: (err) => {
        //Si no existe la predicción, el botón será el de GuardarPrediccion
        if (err.status === 404) {
          this.editarBoton = false;
        }
      },
    });
  }

  cargarPredicciones(predicciones: any[]) {
    this.resetForm(); // Limpia el formulario antes de cargar nuevas predicciones
    console.log(predicciones);

    predicciones.forEach((prediccion) => {
      const equipoEncontrado = this.equipos.find(
        (equipo) => equipo._id === prediccion.idEquipo
      );

      console.log("Equipo encontrado: ", equipoEncontrado);
      
      const prediccionForm = this.fb.group({
        equipo: [equipoEncontrado, [Validators.required]],
        goles: [
          prediccion.goles,
          [Validators.required, Validators.min(1), Validators.max(6)],
        ],
        cantidad: [
          prediccion.cantidad,
          [Validators.required, Validators.min(1)],
        ],
      });

      this.predicciones.push(prediccionForm);
      this.filas.push({}); // Opcional, si manejas alguna lógica con las filas
    });
  }

  onSelectEquipo(event: any, index: number) {
    const selectedEquipo = event.item;
    const formArray = this.golesPrediForm.get('predicciones') as FormArray;
    formArray.at(index).get('equipo').setValue(selectedEquipo.nombreEquipo);
  }

  onSubmit() {
    if (this.golesPrediForm.valid) {
      const predicciones = this.golesPrediForm.get('predicciones').value;
      const dataToSend = {
        jornada: this.numJornada,
        predicciones: predicciones,
      };

      this.crudPrediccionService.crearPredi(this.numJornada, 2, dataToSend).subscribe({
          next: (response) => {
            this.eventService.notifyMonedasActualizadas();
            this.alertifyService.success(response.message);
          },
          error: (err) => {
            if (err.status === 400) {
              this.alertifyService.warning(err.error.message);
            }
            console.log(err.error.message);
          },
        });
    } else {
      this.alertifyService.error('Hay errores en el formulario. Por favor, revisa los campos.');
    }
  }

  onUpdate() {
    if(this.golesPrediForm.valid) {
      const predicciones = this.golesPrediForm.get('predicciones').value;
      const dataToSend = {
        jornada: this.numJornada,
        predicciones: predicciones,
      };
      this.crudPrediccionService.actualizarPredi(this.numJornada, 2, dataToSend).subscribe({
        next: (response) => {
          this.eventService.notifyMonedasActualizadas();
          this.alertifyService.success(response.message);
        },
        error: (err) => {
          console.log(err.error.message);
          if (err.status === 400) {
            this.alertifyService.warning(err.error.message);
          }
        },
      });
    }
    else {
      this.alertifyService.error('Hay errores en el formulario. Por favor, revisa los campos.');
    }
  }

  resetForm() {
    this.golesPrediForm.reset();
    this.predicciones.clear(); // Limpia todas las filas en caso de que existan
    this.filas = [];
  }

  inputFormatter = (x: { nombreEquipo: string }) => x.nombreEquipo;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.equipos
              .filter((v) =>
                v.nombreEquipo.toLowerCase().includes(term.toLowerCase())
              )
              .slice(0, 10)
      )
    );

  resultFormatter = (result: Equipo) => result.nombreEquipo;


  equipoUnicoValidator(formArray: FormArray): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const equipoSeleccionado = control.value;
      const equiposSeleccionados = formArray.controls.map((c: FormGroup) => c.get('equipo').value);
  
      if (equiposSeleccionados.filter(equipo => equipo === equipoSeleccionado).length > 1) {
        return { 'equipoDuplicado': true };
      }
      return null;
    };
}

} 
