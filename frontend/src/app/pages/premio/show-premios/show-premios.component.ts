import { Component, OnInit } from '@angular/core';
import { Premio } from 'src/app/models/premio.model';
import { CrudPremiosService } from 'src/app/services/crud-premios.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowPremioComponent } from '../canjear/show-premio/show-premio.component';


@Component({
  selector: 'app-show-premios',
  templateUrl: './show-premios.component.html',
  styleUrls: ['./show-premios.component.css']
})
export class ShowPremiosComponent implements OnInit{

  constructor(
    private readonly crudPremiosService: CrudPremiosService,
    public authServiceService: AuthServiceService,
    private readonly modalService: NgbModal
  ){}

  premios: Premio[]

  ngOnInit(): void {
    this.crudPremiosService.getPremios().subscribe((res: Premio[]) => {
      this.premios = res
    })
  }

  openModal(idPremio: string) {
    const modal = this.modalService.open(ShowPremioComponent, {
      centered: true,
      backdrop: true,
      size: 'lg'
    });

    modal.componentInstance.idPremio = idPremio;
  }

}
