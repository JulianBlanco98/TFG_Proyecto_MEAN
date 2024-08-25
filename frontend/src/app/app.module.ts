import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowComponent } from './pages/show/show.component';
import { CreateComponent } from './pages/create/create.component';
import { EditComponent } from './pages/edit/edit.component';
import { GenericFormComponent } from './components/generic-form/generic-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowPremiosComponent } from './pages/premio/show-premios/show-premios.component';
import { MenuComponent } from './components/menu/menu.component';
import { ShowEquiposComponent } from './pages/equipo/show-equipos/show-equipos.component';
import { ShowJugadoresEquipoComponent } from './pages/jugadores/show-jugadores-equipo/show-jugadores-equipo.component';
import { ShowJornadaComponent } from './pages/jornada/show-jornada/show-jornada.component';
import { ShowTablaClasificacionComponent } from './pages/clasificacion/show-tabla-clasificacion/show-tabla-clasificacion.component';
import { ModalUsuarioComponent } from './components/modal/modal-usuario/modal-usuario.component';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Ap1Component } from './pages/apuesta/ap1/ap1.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { RolesDirective } from './core/directives/roles.directive';
import { ShowUsuariosComponent } from './pages/usuarios/show/show-usuarios/show-usuarios.component';
import { CreateUsuariosComponent } from './pages/usuarios/crear/create-usuarios/create-usuarios.component';
import { FormUsuariosComponent } from './components/form/form-usuarios/form-usuarios.component';
import { EditUsuariosComponent } from './pages/usuarios/editar/edit-usuarios/edit-usuarios.component';
import { SimularJornadaComponent } from './pages/jornada/simular-jornada/simular-jornada.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { GoleadoresComponent } from './pages/jugadores/max-goleadores/goleadores/goleadores.component';
import { TabClasificacionComponent } from './components/tabs/clasificacion/tab-clasificacion/tab-clasificacion.component';
import { AsistentesComponent } from './pages/jugadores/max-asistentes/asistentes/asistentes.component';
import { ShowPartidoComponent } from './pages/partido/show-partido/show-partido.component';
import { ShowNovedadesComponent } from './pages/novedad/show-novedades/show-novedades.component';
import { SeccionesComponent } from './pages/inicio/secciones/secciones.component';
import { ShowPremioComponent } from './pages/premio/canjear/show-premio/show-premio.component';
import { Ap2Component } from './pages/apuesta/ap2/ap2/ap2.component';
import { Ap3Component } from './pages/apuesta/ap3/ap3.component';
import { HistoricoComponent } from './pages/apuesta/historico/historico.component';
import { MensajesComponent } from './pages/mensajes/mensajes.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowComponent,
    CreateComponent,
    EditComponent,
    GenericFormComponent,
    ShowPremiosComponent,
    MenuComponent,
    ShowEquiposComponent,
    ShowJugadoresEquipoComponent,
    ShowJornadaComponent,
    ShowTablaClasificacionComponent,
    ModalUsuarioComponent,
    Ap1Component,
    RolesDirective,
    ShowUsuariosComponent,
    CreateUsuariosComponent,
    FormUsuariosComponent,
    EditUsuariosComponent,
    SimularJornadaComponent,
    FooterComponent,
    GoleadoresComponent,
    TabClasificacionComponent,
    AsistentesComponent,
    ShowPartidoComponent,
    ShowNovedadesComponent,
    SeccionesComponent,
    ShowPremioComponent,
    Ap2Component,
    Ap3Component,
    HistoricoComponent,
    MensajesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPopoverModule,
    NgbAccordionModule
  ],
  // exports: [
  //   RolesDirective
  // ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
