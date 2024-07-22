import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent {
  
  @Input() tipo: string = ''
  form: FormGroup
  usuario: User
  
  //active modal es el actual
  constructor(public readonly modal: NgbActiveModal){
    this.buildForm()
  }
  
  buildForm(){
    this.form = new FormGroup({
      nombre: new FormControl(''),
      edad: new FormControl(null),
      correo: new FormControl(''),
      password: new FormControl(''),
    })
  }
  
  onSubmit() {
    // --> Poner las validaciones aqui
    const params = {...this.form.value}
    this.modal.close(params)

  }
}
