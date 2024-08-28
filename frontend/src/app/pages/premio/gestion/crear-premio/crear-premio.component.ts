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
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key} - File name: ${value.name}, size: ${value.size}`);
      } else {
        console.log(`${key}:`, value);
      }
    });
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
          console.log(err.message);

        }
      },
    })
  }

}
