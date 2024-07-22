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



@NgModule({
  declarations: [
    VisitaComponent,
    CrearComponent,
    ActualizarComponent,
    PrincipalComponent,
    ValidarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MainModule
  ],

})
export class DashboardModule { }
