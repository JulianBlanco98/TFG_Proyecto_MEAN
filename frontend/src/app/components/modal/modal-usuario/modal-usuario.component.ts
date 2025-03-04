import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit{
  
  @Input() tipo: string = ''
  form: FormGroup
  submit: boolean
  
  //active modal es el actual
  constructor(
    public readonly modal: NgbActiveModal, 
    private readonly authServiceService: AuthServiceService,
    private readonly crudUsersService: CrudUsersService,
    private readonly alertifyService: AlertifyService
  ){
  }
  
  ngOnInit(): void {
    
    this.buildForm()
    //console.log("Tipo: ",this.tipo);
    if(this.tipo === 'editarUsuario'){
      const userId = this.authServiceService.getIdUsuarioToken();
      //console.log("IdUsuario: ", userId);
      if(userId){
        this.crudUsersService.getUsuario(userId).subscribe({
          next: (data: any) => {
            //console.log(data.datos);
            let datosUsuario = { ...data.datos };
            delete datosUsuario.password;
            this.form.patchValue(datosUsuario)
            
          },
          error: (err: any) => {
            this.alertifyService.error('Error al cargar los datos del usuario');
          }

        })
      }
      
    }      
  }
  buildForm() {
    this.form = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    if(this.tipo !== 'login') {
      this.form.addControl('edad', new FormControl(null, [
        Validators.required, Validators.min(18),
      ]));
      this.form.addControl('correo', new FormControl('', [
        Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/)
      ]));
    }
    // this.form = new FormGroup({
    //   nombre: new FormControl('', [Validators.required]),
    //   edad: new FormControl(null, [
    //     Validators.required,
    //     Validators.min(18),
    //   ]),
    //   correo: new FormControl('', [
    //     Validators.required,
    //     Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/)
    //   ]),
    //   password: new FormControl('', [Validators.required]),
    // });
  }
  
  onSubmit() {
    // --> Poner las validaciones aqui
    this.submit = true;
    if(this.form.invalid) {
      console.log("Formulario invalido");
      console.log("Campos de formulario: ", this.form.controls);
      
      
      return;
    }

    console.log("Tipo: ", this.tipo);
    const params = { ...this.form.value };
    console.log("parametros: ", params);
    
    this.modal.close(params);
  }
}
