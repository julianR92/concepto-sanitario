import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './pages/principal/principal.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DescripcionComponent } from './pages/descripcion/descripcion.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { DefinicionComponent } from './pages/definicion/definicion.component';



@NgModule({
  declarations: [
    PrincipalComponent,
    DescripcionComponent,
    DefinicionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PrimeNgModule
  ],
  exports:[
    PrincipalComponent
  ]
})
export class MainModule { }
