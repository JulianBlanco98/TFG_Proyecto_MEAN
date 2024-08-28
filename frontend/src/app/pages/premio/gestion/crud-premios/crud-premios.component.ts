import { Component, OnInit } from '@angular/core';
import { faCirclePlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Premio } from 'src/app/models/premio.model';
import { CrudPremiosService } from 'src/app/services/crud-premios.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-crud-premios',
  templateUrl: './crud-premios.component.html',
  styleUrls: ['./crud-premios.component.css']
})
export class CrudPremiosComponent implements OnInit{

  premios: Premio[]
  faAdd = faCirclePlus;
  faEditar = faPen;
  faBorrar = faTrash;
  constructor(
    private readonly crudPremiosService: CrudPremiosService,
    private readonly alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getPremios();
  }

  getPremios() {
    this.crudPremiosService.getPremios().subscribe((res: Premio[]) => {
      this.premios = res;
      console.log(this.premios);
      
    })
  }
  deletePremio(id: any, index: any){
    this.crudPremiosService.deletePremio(id).subscribe({
      next: (response) => {
        this.premios.splice(index,1);
        this.alertifyService.success(response.message);
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
        console.log(err);
      },
    })
  }
}
