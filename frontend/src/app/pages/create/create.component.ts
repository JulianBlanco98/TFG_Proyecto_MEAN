import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  constructor(
    private router: Router,
    private crudService: CrudService
  ){

  }

  onSubmit(usuario: Usuario){
    console.log("Usuario creado");
    this.crudService.createUsuario(usuario).subscribe({
      next: () => {
        this.router.navigateByUrl("/")
      },
      error: (error) => {
        console.log(error);
        
      }
    })
    
  }
}
