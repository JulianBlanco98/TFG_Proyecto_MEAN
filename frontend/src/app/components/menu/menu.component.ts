import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faHome,
  faMoneyCheckDollar,
  faTrophy,
  faBook,
  faGift,
  faUser,
  faUserSecret,
  faFootballBall,
  faFireFlameCurved,
  faFutbol,
  faSocks,
  faRectangleList,
  faScaleBalanced
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsuarioComponent } from '../modal/modal-usuario/modal-usuario.component';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, OnDestroy {
  constructor(
    private readonly modalService: NgbModal,
    private readonly crudUsersService: CrudUsersService,
    private readonly alertifyService: AlertifyService,
    public authServiceService: AuthServiceService,
    private readonly eventService: EventService,
    private readonly router: Router,
    private readonly crudJornadaService: CrudJornadaService,
  ) {}

  faHome = faHome;
  faTrophy = faTrophy;
  faBook = faBook;
  faGift = faGift;
  faUser = faUser;
  faAdmin = faUserSecret;
  faJornada = faFootballBall;
  faPredicciones = faScaleBalanced
  faQuiniela = faMoneyCheckDollar;
  faNovedad = faFireFlameCurved;
  faGoles = faFutbol;
  faAsistencias = faSocks;
  faHistorico = faRectangleList;

  monedaJugador: number | null = null;
  numJornada: number

  moneda$: Subscription
  jornada$: Subscription

  ngOnInit(): void {
    if (this.authServiceService.isAuthenticated()) {
      this.updateMonedas();
    }
    this.getNumeroJornadaActual();

    this.moneda$ = this.eventService.monedasActualizadas$.subscribe(() => {
      this.updateMonedas(); // Actualizar monedas cuando se notifique
    });

    this.jornada$ = this.eventService.jornadasActualizadas$.subscribe(() => {
      this.getNumeroJornadaActual();
    })

  }

  ngOnDestroy(): void {
    this.moneda$.unsubscribe();
    this.jornada$.unsubscribe();
  }

  updateMonedas() {
    const idUsuario = this.authServiceService.getIdUsuarioToken();
    if (idUsuario) {
      this.crudUsersService.getMonedaById(idUsuario).subscribe({
        next: (data: any) => {
          this.monedaJugador = data.moneda;
        },
        error: (err: any) => {
          console.error('Error al obtener las monedas del usuario:', err);
          this.monedaJugador = 0;
        },
      });
    } else {
      this.monedaJugador = 0;
    }
  }

  getNumeroJornadaActual() {
    this.crudJornadaService.getNumeroJornadaNovedad().subscribe({
      next: (data: any) => {
        this.numJornada = data.numeroJornadaActual;
        console.log("Jornada actual: ",this.numJornada);
        
      },
      error: (err: any) => {
        console.error('Error al obtener la jornada', err);
        this.numJornada = err.error.numeroJornada;
      },
    })
  }

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
        } else if (tipo === 'login') {
          nameService = 'login';
        } else {
          nameService = 'editarUsuario';
        }
        this.typeSubmit(nameService, response);
      },
      () => {
        //este es el evento de darle a la x para cerrar
      }
    );
  }

  //Mover esta lógica al crud-user-service.ts y crear un
  typeSubmit(service: any, response: any) {
    this.crudUsersService[service](response).subscribe({
      next: (data: any) => {
        this.alertifyService.success(data.message);
        if (service === 'login') {
          this.authServiceService.setToken(data.token);
          this.updateMonedas();

          //Si el usuario es el admin, redirijo a la pestaña de usuarios
          this.authServiceService.getRolUsuarioToken().subscribe((rolUsuario) => {
            if (rolUsuario === 'admin') {
              this.router.navigateByUrl('/usuarios');
            }
          });
        }
      },
      error: (err: any) => {
        // console.log("error: ", err);
        this.alertifyService.error(err.error.message);
      },
    });
  }

  logOut() {
    this.authServiceService.removeToken();
    this.eventService.setNewRoles('nologin');
    this.monedaJugador = 0;
    this.router.navigateByUrl('/');
    this.alertifyService.success('Sesion cerrada correctamente');
  }
}
