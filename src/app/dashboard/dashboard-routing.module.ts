import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { CrearComponent } from './pages/crear/crear.component';
import { ActualizarComponent } from './pages/actualizar/actualizar.component';
import { VisitaComponent } from './pages/visita/visita.component';
import { ValidarComponent } from './pages/validar/validar.component';
import { SelectEstablecimientosComponent } from './pages/select-establecimientos/select-establecimientos.component';
import { FinalizaComponent } from './pages/finaliza/finaliza.component';
import { FormUpdateComponent } from './pages/form-update/form-update.component';

const routes: Routes = [
  {
    path: '',
    component: PrincipalComponent,
  },
  {
    path: 'validar',
    component: ValidarComponent,
  },
  {
    path: 'registrar',
    component: CrearComponent,
  },
  {
    path: 'escoge',
    component: SelectEstablecimientosComponent,
  },
  {
    path: 'actualizar',
    component: ActualizarComponent
   },
  {
    path: 'actualizarEstablecimiento',
    component: FormUpdateComponent
   },
  {
    path: 'visita', component: VisitaComponent
  },
  {
    path: 'finaliza', component: FinalizaComponent
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
