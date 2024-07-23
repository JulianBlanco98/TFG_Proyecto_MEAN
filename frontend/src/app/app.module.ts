import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowComponent } from './pages/show/show.component';
import { CreateComponent } from './pages/create/create.component';
import { EditComponent } from './pages/edit/edit.component';
import { GenericFormComponent } from './components/generic-form/generic-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowPremiosComponent } from './pages/premio/show-premios/show-premios.component';
import { MenuComponent } from './components/menu/menu.component';
import { ShowEquiposComponent } from './pages/equipo/show-equipos/show-equipos.component';
import { ShowJugadoresEquipoComponent } from './pages/jugadores/show-jugadores-equipo/show-jugadores-equipo.component';
import { ShowJornadaComponent } from './pages/jornada/show-jornada/show-jornada.component';
import { ShowTablaClasificacionComponent } from './pages/clasificacion/show-tabla-clasificacion/show-tabla-clasificacion.component';
import { ModalUsuarioComponent } from './components/modal/modal-usuario/modal-usuario.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ap1Component } from './pages/apuesta/ap1/ap1.component';

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
    Ap1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
