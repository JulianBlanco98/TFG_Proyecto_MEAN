import { Component, Input, OnInit } from '@angular/core';
import { Premio } from 'src/app/models/premio.model';
import { CrudPremiosService } from 'src/app/services/crud-premios.service';

@Component({
  selector: 'app-show-premio',
  templateUrl: './show-premio.component.html',
  styleUrls: ['./show-premio.component.css']
})
export class ShowPremioComponent implements OnInit{

  @Input() idPremio: string;
  premio: Premio

  constructor(
    private readonly crudPremiosService: CrudPremiosService
  ) {}

  ngOnInit(): void {
    this.getPremioById();
  }

  getPremioById() {
    this.crudPremiosService.getPremioById(this.idPremio).subscribe({
      next: (data: any) => {
        this.premio = data;
        console.log(this.premio);
        
      }
    })
  }
}
