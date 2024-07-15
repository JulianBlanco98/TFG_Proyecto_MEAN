import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowComponent } from './pages/show/show.component';
import { CreateComponent } from './pages/create/create.component';
import { EditComponent } from './pages/edit/edit.component';
import { MenuComponent } from './components/menu/menu.component';
import { ShowPremiosComponent } from './pages/premio/show-premios/show-premios.component';
import { ShowEquiposComponent } from './pages/equipo/show-equipos/show-equipos.component';

const routes: Routes = [
  {
    path:'', component: ShowComponent
  },
  {
    path:'create', component:CreateComponent
  },
  {
    path:'update/:id', component:EditComponent
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
