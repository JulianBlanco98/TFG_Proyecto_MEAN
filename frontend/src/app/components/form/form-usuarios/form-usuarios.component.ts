import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-usuarios',
  templateUrl: './form-usuarios.component.html',
  styleUrls: ['./form-usuarios.component.css']
})
export class FormUsuariosComponent implements OnInit{


  formUsuario: FormGroup
  
  @Input() modelUsuario: User
  @Input() isEdit: boolean;
  
  @Output() submitValues: EventEmitter<User> = new EventEmitter<User>()

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly crudUsersService: CrudUsersService,
    private readonly router: Router
  ){
    this.formUsuario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(18)]],
      correo: ['', [Validators.required, Validators.email]],
      moneda: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    
  }
  get formControls() {
    return this.formUsuario.controls;
  }
  onSubmit():void{
    console.log("Submit");
    this.submitValues.emit(this.formUsuario.value)
  }
  ngOnChanges(): void {
    //console.log("modelo de usuario: ",this.modelUsuario);
    
    if (this.modelUsuario) {
      
      this.formUsuario.patchValue({
        nombre: this.modelUsuario.datos.nombre,
        edad: this.modelUsuario.datos.edad,
        moneda: this.modelUsuario.moneda,
        correo: this.modelUsuario.datos.correo,
      })
    }
  }

  volverAtras() {
    this.router.navigate(['/usuarios']);
  }



}
