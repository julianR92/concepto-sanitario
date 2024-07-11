import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './pages/principal/principal.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    PrincipalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports:[
    PrincipalComponent
  ]
})
export class MainModule { }
