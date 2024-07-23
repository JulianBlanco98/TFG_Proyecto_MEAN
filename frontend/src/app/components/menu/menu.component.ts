import { Component } from '@angular/core';
import {
  faHome,
  faMoneyCheckDollar,
  faTrophy,
  faBook,
  faGift,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsuarioComponent } from '../modal/modal-usuario/modal-usuario.component';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(
    private readonly modalService: NgbModal,
    private readonly crudUsersService: CrudUsersService,
    private readonly alertifyService: AlertifyService,
    public authServiceService: AuthServiceService
  ) {}

  faHome = faHome;
  faMoney = faMoneyCheckDollar;
  faTrophy = faTrophy;
  faBook = faBook;
  faGift = faGift;
  faUser = faUser;

  openModal(tipo: string) {
    const modal = this.modalService.open(ModalUsuarioComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });

    //El tipo me dice si es login, registro o editar
    modal.componentInstance.tipo = tipo;

    modal.result.then(
      (result) => {
        const response = result;
        //console.log(response);
        let nameService: string;
        if (tipo === 'registro') {
          nameService = 'registro';
        } else if(tipo === 'login') {
          nameService = 'login';
        }
        else{
          nameService = 'editarUsuario'
        }
        this.typeSubmit(nameService, response);
      },
      () => {
        //este es el evento de darle a la x para cerrar
      }
    );
  }

  typeSubmit(service: any, response: any) {
    this.crudUsersService[service](response).subscribe({
      next: (data: any) => {
        this.alertifyService.success(data.message);
        if(service === 'login'){
          this.authServiceService.setToken(data.token)
        }
       
      },
      error: (err: any) => {
        // console.log("error: ", err);
        this.alertifyService.error(err.error.message);
      },
    });
  }

  logOut(){
    this.authServiceService.removeToken();
    this.alertifyService.success("Sesion cerrada correctamente");
  }
}
