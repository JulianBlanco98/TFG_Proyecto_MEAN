import { Component, OnInit } from '@angular/core';
import { faCirclePlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Usuario } from 'src/app/models/usuario.model';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit{
  faCirclePlus = faCirclePlus
  faPen = faPen
  faTrash = faTrash

  usuarios: Usuario[] = [] //Array de usuarios vacios

  constructor(private crudService: CrudService){

  }

  ngOnInit(): void {
    this.crudService.getUsuarios().subscribe((res: Usuario[]) => {
      // console.log(res);
      this.usuarios = res
    })
  }

  delete(id:any, index:any){
    this.crudService.deleteUsuario(id).subscribe((res) => {
      this.usuarios.splice(index,1)
    })
    
  }
}
