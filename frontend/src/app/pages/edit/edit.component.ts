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

  id!: any
  modelUsuario: Usuario

  constructor(
    private crudService: CrudService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){

  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.crudService.getusuario(this.id).subscribe( (res) => {
      this.modelUsuario = {
        _id: res.id,
        nombre: res.nombre,
        edad: res.edad,
        correo: res.correo,
        saldo: res.saldo,
        password: res.password
      }
    })
  }

  onSubmit(usuario: Usuario){
    this.crudService.updateUsuario(this.id, usuario).subscribe({
      next:() => {
        this.router.navigateByUrl('/')
      },
      error:(error) => {
        console.log(error);
        
      }
    })
  }

}
