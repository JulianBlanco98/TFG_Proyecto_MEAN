import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-edit-usuarios',
  templateUrl: './edit-usuarios.component.html',
  styleUrls: ['./edit-usuarios.component.css']
})
export class EditUsuariosComponent implements OnInit{

  id!: any;
  modelUsuario: User = {
    _id:'',
    datos: {
      nombre: '',
      edad: 0,
      correo: '',
      password:''
    },
    moneda: 0,
    rol:''
  };

  constructor(
    private readonly crudUsersService: CrudUsersService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertifyService: AlertifyService
  ){}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id){
      this.crudUsersService.getUsuario(this.id).subscribe({
        next: (response) => {
          //console.log(response);
          
          this.modelUsuario = {
            _id: response?._id || null,
            datos: {
              nombre: response?.datos.nombre || null,
              edad: response?.datos.edad,
              correo: response?.datos.correo,
              password: response?.datos.password
            },
            moneda: response?.moneda,
            rol: response?.rol
          }
        },
        error: (err) => {
          console.log("Error al obtener el usuario: ",err);
          
        }
      })
    }
  }

  onSubmit(data: any): void {
    if(this.id){
      this.crudUsersService.updateUsuario(this.id, data).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigateByUrl("/usuarios")
          this.alertifyService.success(response.message)
        },
        error: (err) => {
          console.log(err);
          
        }
      })
    }
  }

}
