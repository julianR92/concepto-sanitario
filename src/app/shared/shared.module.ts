import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FooterComponent } from './components/footer/footer.component';
import { MigaComponent } from './components/miga/miga.component';
import { LineaAvanceComponent } from './components/linea-avance/linea-avance.component';
import { StepperComponent } from './components/stepper/stepper.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MigaComponent,
    LineaAvanceComponent,
    StepperComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    MigaComponent,
    LineaAvanceComponent,
  ]
})
export class SharedModule { }
