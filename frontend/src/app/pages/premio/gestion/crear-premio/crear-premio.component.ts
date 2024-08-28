import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudPremiosService } from 'src/app/services/crud-premios.service';
import { AlertifyService } from 'src/app/services/alertify.service';


@Component({
  selector: 'app-crear-premio',
  templateUrl: './crear-premio.component.html',
  styleUrls: ['./crear-premio.component.css']
})
export class CrearPremioComponent {

  constructor(
    private readonly router: Router,
    private readonly  crudPremiosService: CrudPremiosService,
    private readonly alertifyService: AlertifyService
  ) {}

  onSubmit(formData: FormData) {
    this.crudPremiosService.crearPremio(formData).subscribe({
      next: (response) => {
        console.log(response);
        
        this.router.navigateByUrl("adminPremios");
        this.alertifyService.success(response.message);
      },
      error: (err) => {
        if(err.status === 400){
          this.router.navigateByUrl("/createPremios")         
          this.alertifyService.error(err.error.message)
        }
        else{
          console.log(err);

        }
      },
    })
  }

}
