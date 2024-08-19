import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowComponent } from './pages/show/show.component';
import { MenuComponent } from './components/menu/menu.component';
import { ShowPremiosComponent } from './pages/premio/show-premios/show-premios.component';
import { ShowEquiposComponent } from './pages/equipo/show-equipos/show-equipos.component';
import { ShowJugadoresEquipoComponent } from './pages/jugadores/show-jugadores-equipo/show-jugadores-equipo.component';
import { ShowTablaClasificacionComponent } from './pages/clasificacion/show-tabla-clasificacion/show-tabla-clasificacion.component';
import { Ap1Component } from './pages/apuesta/ap1/ap1.component';
import { loginGuard } from './core/guards/login.guard';
import { loginAdmin, loginUsuario } from './core/guards/roles.guard';
import { ShowUsuariosComponent } from './pages/usuarios/show/show-usuarios/show-usuarios.component';
import { CreateUsuariosComponent } from './pages/usuarios/crear/create-usuarios/create-usuarios.component';
import { EditUsuariosComponent } from './pages/usuarios/editar/edit-usuarios/edit-usuarios.component';
import { SimularJornadaComponent } from './pages/jornada/simular-jornada/simular-jornada.component';
import { TabClasificacionComponent } from './components/tabs/clasificacion/tab-clasificacion/tab-clasificacion.component';
import { ShowNovedadesComponent } from './pages/novedad/show-novedades/show-novedades.component';
import { SeccionesComponent } from './pages/inicio/secciones/secciones.component';
import { Ap2Component } from './pages/apuesta/ap2/ap2/ap2.component';
import { Ap3Component } from './pages/apuesta/ap3/ap3.component';
import { HistoricoComponent } from './pages/apuesta/historico/historico.component';

const routes: Routes = [
  {
    path:'', component: SeccionesComponent
  },
  {
    path:'create', component:CreateUsuariosComponent,
    canActivate: [loginGuard, loginAdmin]
  },
  {
    path: 'novedades', component: ShowNovedadesComponent
  },
  {
    path:'quiniela', component: Ap1Component,
    canActivate: [loginGuard, loginUsuario]
  },
  {
    path:'ap_Goles', component: Ap2Component,
    canActivate: [loginGuard, loginUsuario]
  },
  {
    path:'ap_Asistencias', component: Ap3Component,
    canActivate: [loginGuard, loginUsuario]
  },
  {
    path:'historico', component: HistoricoComponent,
    canActivate: [loginGuard, loginUsuario]
  },
  {
    path: 'usuarios', component: ShowUsuariosComponent,
    canActivate: [loginGuard, loginAdmin]
  },
  {
    path:'jugadores/:idApi', component: ShowJugadoresEquipoComponent
  },
  {
    path:'update/:id', component:EditUsuariosComponent,
    canActivate: [loginGuard, loginAdmin]
  },
  {
    path:'clasificacion', component: TabClasificacionComponent
  },
  {
    path: 'adminJornadas', component: SimularJornadaComponent,
    canActivate: [loginGuard, loginAdmin]
  },
  {
    path:'premios', component: ShowPremiosComponent
  },
  {
    path:'equipos', component: ShowEquiposComponent
  },
  {
    path:'**', redirectTo: '' //Hacer un componente de page not found
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
