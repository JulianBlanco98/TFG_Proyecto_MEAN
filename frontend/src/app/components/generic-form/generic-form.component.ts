import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css']
})
export class GenericFormComponent implements OnInit{
  
  formUsuario: FormGroup

  @Input()
  modelUsuario: Usuario

  @Output()
  submitValues:EventEmitter<Usuario> = new EventEmitter<Usuario>()

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private router: Router,
  ){

    this.formUsuario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(18)]],
      correo: ['', [Validators.required, Validators.email]],
      saldo: ['', [Validators.required, Validators.min(0)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });


  }
  

  ngOnInit(): void {
    if(this.modelUsuario !== undefined){
      console.log("Entra, pero no cambia los valores");
      console.log(this.modelUsuario);
      
      
      this.formUsuario.patchValue(this.modelUsuario)
    }
    else{
      console.log("No coge los valores");
      console.log(this.modelUsuario);
      
    }
  }

  get formControls() {
    return this.formUsuario.controls;
  }

  onSubmit():void{
    console.log("Submit");
    this.submitValues.emit(this.formUsuario.value)
    
  }

}
