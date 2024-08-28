import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Premio } from 'src/app/models/premio.model';
import { CrudPremiosService } from 'src/app/services/crud-premios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-premios',
  templateUrl: './form-premios.component.html',
  styleUrls: ['./form-premios.component.css']
})
export class FormPremiosComponent implements OnInit{

  formPremio: FormGroup
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @Input() modelPremio: Premio
  @Input() isEdit: boolean;

  @Output() submitValues: EventEmitter<FormData> = new EventEmitter<FormData>()

  private premioInicial: Premio | null = null

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly crudPremiosService: CrudPremiosService,
    private readonly router: Router
  )
  {
    this.formPremio = this.formBuilder.group({
      nombrePremio: ['', [Validators.required, Validators.minLength(4)]],
      imagenPremio: ['', [Validators.required]],
      saldo: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.modelPremio) {
      this.setFormValues(this.modelPremio);
      this.premioInicial = { ...this.modelPremio }; // Guardar los valores iniciales
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modelPremio'] && this.modelPremio) {
      this.setFormValues(this.modelPremio);
      this.premioInicial = { ...this.modelPremio }; // Guardar los valores iniciales
    }
  }

  private setFormValues(premio: Premio): void {
    this.formPremio.patchValue({
      nombrePremio: premio.nombrePremio,
      saldo: premio.saldoPremio
    });

    // Para la imagen, necesitarás manejarlo de manera diferente, ya que no puedes previsualizar una imagen desde un URL sin cargarla.
    this.imagePreview = premio.imagenPremio; // Asumimos que premio.imagenPremio es un URL o una cadena base64
  }

  get formControls() {
    return this.formPremio.controls;
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.formPremio.patchValue({ imagenPremio: this.selectedFile.name });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Asigna el resultado de la lectura a la variable de previsualización
      };
      reader.readAsDataURL(this.selectedFile); // Lee el archivo como una URL de datos
    
    }
  }

  onSubmit():void {
    if (this.formPremio.valid) {
      console.log("Tamaño archivo: ",this.selectedFile?.size);
      // console.log("Nombre Premio: ", this.formPremio.get('nombrePremio')?.value);
      // console.log("Saldo: ", this.formPremio.get('saldo')?.value);
      // console.log("Archivo: ", this.selectedFile);
      
      const formData = new FormData();
      formData.append('nombrePremio', this.formPremio.get('nombrePremio')?.value);
      formData.append('saldo', this.formPremio.get('saldo')?.value);
      if (this.selectedFile) {
        formData.append('imagenPremio', this.selectedFile, this.selectedFile.name);
      }
     
      
      this.submitValues.emit(formData);
    }
  }
  onReset(): void {
    if (this.premioInicial) {
      this.formPremio.patchValue({
        nombrePremio: this.premioInicial.nombrePremio,
        saldo: this.premioInicial.saldoPremio
      });
  
      // Mantener la imagen de vista previa, si existe
      this.imagePreview = this.premioInicial.imagenPremio;
      this.selectedFile = null; // Asegúrate de que no haya archivo seleccionado
    } else {
      this.formPremio.reset({
        nombrePremio: '',
        saldo: ''
      });
      this.imagePreview = null; // Limpiar la previsualización
      this.selectedFile = null; // Limpiar el archivo seleccionado
    }
  }
  
  volverAtras() {
    this.router.navigate(['/adminPremios']);
  }

}
