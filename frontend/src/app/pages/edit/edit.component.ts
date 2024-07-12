import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit{

  id!: any;
  modelUsuario: Usuario = {
    _id: '',
    nombre: '',
    edad: 0,
    correo: '',
    saldo: 0,
    password: ''
  };

  constructor(
    private crudService: CrudService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {    
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (this.id) {
      this.crudService.getusuario(this.id).subscribe({
        next: (res) => {    
          //console.log('Respuesta del servicio getusuario:', res);
          //console.log("IdUsuario respuesta: ", res.usuario._id);   
          this.modelUsuario = {
            _id: res?.usuario?._id || null,
            nombre: res?.usuario?.nombre || null, 
            edad: res.usuario.edad,
            correo: res.usuario.correo,
            saldo: res.usuario.saldo,
            password: res.usuario.password
          };
        },
        error: (error) => {
          console.log("Error al obtener el usuario: ", error);
        }
      });
    } else {
      console.log('No se encontró un ID en la ruta.');
    }
  }

  onSubmit(usuario: Usuario): void {
    if (this.id) {
      this.crudService.updateUsuario(this.id, usuario).subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
