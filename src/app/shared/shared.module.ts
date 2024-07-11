import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FooterComponent } from './components/footer/footer.component';
import { MigaComponent } from './components/miga/miga.component';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MigaComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    MigaComponent

  ]
})
export class SharedModule { }
