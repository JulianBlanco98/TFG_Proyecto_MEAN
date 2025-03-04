import { Component, OnInit } from '@angular/core';
import * as Aos from 'aos';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsuarioComponent } from '../../../components/modal/modal-usuario/modal-usuario.component';
import { CrudUsersService } from 'src/app/services/crud-users.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.css'],
})
export class SeccionesComponent implements OnInit {

  numJornada: number;
  contactForm: FormGroup;

  constructor(
    private readonly modalService: NgbModal,
    private readonly crudUsersService: CrudUsersService,
    private readonly alertifyService: AlertifyService,
    public authServiceService: AuthServiceService,
    private readonly router: Router,
    private readonly eventService: EventService,
    private readonly crudJornadaService: CrudJornadaService,
    private fb: FormBuilder,
    private readonly mensajesService: MensajesService
  ){
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      motivo: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    Aos.init({
      // Global settings:
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
      initClassName: 'aos-init', // class applied after initialization
      animatedClassName: 'aos-animate', // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 800, // values from 0 to 3000, with step 50ms
      easing: 'ease-out-cubic', // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
    });

    this.getJornadaActual();

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

  showAlerta() {
    if(!this.authServiceService.isAuthenticated()){
      this.alertifyService.warning('Tienes que estar logueado para poder ver esta sección')
    }
  }
  showAlerta2() {
    if(this.numJornada === 0){
      this.alertifyService.warning('Todavía no se ha jugado la primera jornada')
    }
  }

  getJornadaActual() {
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

  onSubmit() {
    console.log("Datos: ", this.contactForm.value);
    if(this.contactForm.valid){
      this.mensajesService.crearMensaje(this.contactForm.value).subscribe({
        next: (response: any) => {
          this.alertifyService.success(response.message);
        },
        error: (err: any) => {
          this.alertifyService.success(err.error.message);
          
        },
      })
    }
    else{
      this.alertifyService.warning('Tienes algún campo inválido')
    }
  }

}
