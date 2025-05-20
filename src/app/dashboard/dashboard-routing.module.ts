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
import { ValidarAutoevaluacionComponent } from './pages/validar-autoevaluacion/validar-autoevaluacion.component';
import { AutoevaluacionComponent } from './pages/autoevaluacion/autoevaluacion.component';
import { FinalizaAutoevaluacionComponent } from './pages/finaliza-autoevaluacion/finaliza-autoevaluacion.component';
import { ValidarVisitaComponent } from './pages/validar-visita/validar-visita.component';
import { FinalizaVisitaComponent } from './pages/finaliza-visita/finaliza-visita.component';
import { InformacionVisitaComponent } from './pages/informacion-visita/informacion-visita.component';
import { RecordarIvcComponent } from './pages/recordar-ivc/recordar-ivc.component';
import { QuestionsComponent } from './pages/questions/questions.component';

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
    path: 'validar-autoevaluacion',
    component: ValidarAutoevaluacionComponent
   },
  {
    path: 'validar-visita',
    component: ValidarVisitaComponent
   },
  {
    path: 'autoevaluacion',
    component: AutoevaluacionComponent
   },
  {
    path: 'autoevaluacion-finalizada',
    component: FinalizaAutoevaluacionComponent
   },
  {
    path: 'visita-finalizada',
    component: FinalizaVisitaComponent
  },
  {
    path: 'actualizarEstablecimiento',
    component: FormUpdateComponent
   },
  {
    path: 'informacion-visita',
    component: InformacionVisitaComponent
   },
  {
    path: 'visita', component: VisitaComponent
  },
  {
    path: 'finaliza', component: FinalizaComponent
  },
  {
    path: 'recordar-inscripcion', component: RecordarIvcComponent
  },
  {
    path: 'preguntas-validacion', component: QuestionsComponent
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
