import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitaComponent } from './pages/visita/visita.component';
import { CrearComponent } from './pages/crear/crear.component';
import { ActualizarComponent } from './pages/actualizar/actualizar.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MainModule } from '../main/main.module';
import { ValidarComponent } from './pages/validar/validar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectEstablecimientosComponent } from './pages/select-establecimientos/select-establecimientos.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { FinalizaComponent } from './pages/finaliza/finaliza.component';
import { RouterModule } from '@angular/router';
import { FormUpdateComponent } from './pages/form-update/form-update.component';
import { ValidarAutoevaluacionComponent } from './pages/validar-autoevaluacion/validar-autoevaluacion.component';
import { AutoevaluacionComponent } from './pages/autoevaluacion/autoevaluacion.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FinalizaAutoevaluacionComponent } from './pages/finaliza-autoevaluacion/finaliza-autoevaluacion.component';
import { ValidarVisitaComponent } from './pages/validar-visita/validar-visita.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { RecomendacionesComponent } from './components/recomendaciones/recomendaciones.component';
import { FinalizaVisitaComponent } from './pages/finaliza-visita/finaliza-visita.component';
import { InformacionVisitaComponent } from './pages/informacion-visita/informacion-visita.component';
import { NgSelectModule } from '@ng-select/ng-select';





@NgModule({
  declarations: [
    VisitaComponent,
    CrearComponent,
    ActualizarComponent,
    PrincipalComponent,
    ValidarComponent,
    SelectEstablecimientosComponent,
    FinalizaComponent,
    FormUpdateComponent,
    ValidarAutoevaluacionComponent,
    AutoevaluacionComponent,
    FinalizaAutoevaluacionComponent,
    ValidarVisitaComponent,
    FileUploadComponent,
    RecomendacionesComponent,
    FinalizaVisitaComponent,
    InformacionVisitaComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MainModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RouterModule,
    NgxDocViewerModule,
    PrimeNgModule,
    NgSelectModule



  ],

})
export class DashboardModule { }
