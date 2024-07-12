import { Component, OnInit } from '@angular/core';
import { Premio } from 'src/app/models/premio.model';
import { CrudPremiosService } from 'src/app/services/crud-premios.service';

@Component({
  selector: 'app-show-premios',
  templateUrl: './show-premios.component.html',
  styleUrls: ['./show-premios.component.css']
})
export class ShowPremiosComponent implements OnInit{

  constructor(private crudPremiosService: CrudPremiosService){}

  premios: Premio[]

  ngOnInit(): void {
    this.crudPremiosService.getPremios().subscribe((res: Premio[]) => {
      this.premios = res
    })
  }

}
