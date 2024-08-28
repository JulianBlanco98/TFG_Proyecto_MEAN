import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Premio } from 'src/app/models/premio.model';
import { CrudPremiosService } from 'src/app/services/crud-premios.service';


@Component({
  selector: 'app-editar-premio',
  templateUrl: './editar-premio.component.html',
  styleUrls: ['./editar-premio.component.css']
})
export class EditarPremioComponent implements OnInit{


  id!: any;
  modelPremio: Premio = {
    _id: '',
    nombrePremio: '',
    imagenPremio: '',
    saldoPremio: 0
  }

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly crudPremiosService: CrudPremiosService
  ){}

  ngOnInit(): void {
    this.getPremioById();
  }
  getPremioById() {
    this.id = this.activatedRoute.snapshot.paramMap.get('idPremio');
    if(this.id) {
      this.crudPremiosService.getPremioById(this.id).subscribe({
        next: (response) => {
          // console.log(response);
          
          this.modelPremio = {
            _id: response?.premio?._id,
            nombrePremio: response?.premio?.nombrePremio,
            imagenPremio: response?.premio?.imagenPremio,
            saldoPremio: response?.premio?.saldoPremio
          }
          // console.log(this.modelPremio);
          
        },
        error: (err) => {
          console.log(err);
          
        },
      }) 
        
    }

  }

  onSubmit(data: any) {

  }
}
