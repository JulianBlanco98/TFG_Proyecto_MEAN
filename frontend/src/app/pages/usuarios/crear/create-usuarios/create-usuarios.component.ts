import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-create-usuarios',
  templateUrl: './create-usuarios.component.html',
  styleUrls: ['./create-usuarios.component.css']
})
export class CreateUsuariosComponent {

  constructor(
    private readonly router: Router,
    private readonly crudUsersService: CrudUsersService,
    private readonly alertifyService: AlertifyService
  ){}

  onSubmit(data: any){
    this.crudUsersService.createUsuarioAdmin(data).subscribe({
      next:(response) => {
        this.router.navigateByUrl("/")
        this.alertifyService.success(response.message);
      },
      error: (err) => {
        if(err.status === 400){
          this.router.navigateByUrl("/create")         
          this.alertifyService.error(err.error.message)
        }
        else{
          console.log(err);

        }
        
      }
    })
  }

}
