import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { CrearComponent } from './pages/crear/crear.component';
import { ActualizarComponent } from './pages/actualizar/actualizar.component';
import { VisitaComponent } from './pages/visita/visita.component';

const routes: Routes = [
  {
    path: '',
    component: PrincipalComponent,
  },
  {
    path: 'registrar',
    component: CrearComponent,
  },
  {
    path: 'actualizar',
    component: ActualizarComponent
   },
  {
    path: 'visita', component: VisitaComponent
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
