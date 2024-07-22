import { Component } from '@angular/core';
import {
  faHome,
  faMoneyCheckDollar,
  faTrophy,
  faBook,
  faGift,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsuarioComponent } from '../modal/modal-usuario/modal-usuario.component';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private readonly modalService: NgbModal,
    private readonly crudUsersService: CrudUsersService,
    private readonly alertifyService: AlertifyService
  ){
    
  }

  faHome = faHome;
  faMoney = faMoneyCheckDollar;
  faTrophy = faTrophy;
  faBook = faBook;
  faGift = faGift;

  openModal() {
    const modal = this.modalService.open(ModalUsuarioComponent, {
      centered: true,
      backdrop: true,
      size: 'md'
    })
    modal.result
      .then((result) => {
        const response = result;
        console.log(response);
        this.crudUsersService.registro(response).subscribe({
          next: (data) => {
            this.alertifyService.success(data.message)
          },
          error: (err) => {
            console.log("error: ", err);
            this.alertifyService.warning(err.message);
            
          }
        })
      },
      () => { //este es el evento de darle a la x para cerrar

      }
    )
  }
}
