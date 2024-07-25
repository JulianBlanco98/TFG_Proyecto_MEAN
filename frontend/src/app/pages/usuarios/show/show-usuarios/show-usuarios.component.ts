import { Component, OnInit } from '@angular/core';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { faCirclePlus, faPen, faTrash, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { AlertifyService } from 'src/app/services/alertify.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-show-usuarios',
  templateUrl: './show-usuarios.component.html',
  styleUrls: ['./show-usuarios.component.css']
})
export class ShowUsuariosComponent implements OnInit{


  faCirclePlus = faCirclePlus
  faPen = faPen
  faTrash = faTrash
  faUsers = faUserFriends

  usuarios: User[] = []

  constructor(
    private readonly crudUsersService: CrudUsersService,
    private readonly alertifyService: AlertifyService
  ){}

  ngOnInit(): void {
    this.crudUsersService.getUsuarios().subscribe((res: User[]) => {
      this.usuarios = res;
      console.log(this.usuarios);
      
    })
  }

  delete(id: any, index: any){
    this.crudUsersService.deleteUsuarios(id).subscribe({
      next: (response) => {
        this.usuarios.splice(index, 1)
        this.alertifyService.success(response.message)
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }

}
