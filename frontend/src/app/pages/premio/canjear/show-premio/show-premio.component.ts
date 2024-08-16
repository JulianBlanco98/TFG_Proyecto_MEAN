import { Component, Input, OnInit } from '@angular/core';
import { Premio } from 'src/app/models/premio.model';
import { CrudPremiosService } from 'src/app/services/crud-premios.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-show-premio',
  templateUrl: './show-premio.component.html',
  styleUrls: ['./show-premio.component.css']
})
export class ShowPremioComponent implements OnInit{

  @Input() idPremio: string;
  premio: Premio = null;
  monedaUsuario: number;

  constructor(
    public readonly modal: NgbActiveModal,
    private readonly crudPremiosService: CrudPremiosService,
    private readonly crudUsersService: CrudUsersService,
    private readonly authServiceService: AuthServiceService,
    private readonly alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getPremioById();
    this.getMonedaUsuario();
  }

  getPremioById() {
    if(this.idPremio){

      this.crudPremiosService.getPremioById(this.idPremio).subscribe({
        next: (data: any) => {
          this.premio = data.premio;     
        },
        error: (err: any) => {
          console.log(err.error.message);
          
        }
      })
    }
  }
  getMonedaUsuario() {

    const idUsuario = this.authServiceService.getIdUsuarioToken();
    if(idUsuario){
      this.crudUsersService.getMonedaById(idUsuario).subscribe({
        next: (data: any) => {
          this.monedaUsuario = data.moneda;
        },
        error: (err: any) => {
          console.log(err.error.message);
          
        }
      })
    }
  }

  canjearPremio() {
    this.crudPremiosService.canjearPremio(this.premio._id).subscribe({
      next: (data: any) => {
        console.log("Datos: ",data);
        this.alertifyService.success(data.message);
        
      },
      error: (err: any) => {
        if(err.status === 400){
          this.alertifyService.error(err.error.message)
        }
        console.log("Error de canjear: ",err.error.message);      
      }
    })
  }
}
