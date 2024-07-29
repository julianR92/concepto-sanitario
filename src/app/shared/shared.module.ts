import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FooterComponent } from './components/footer/footer.component';
import { MigaComponent } from './components/miga/miga.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AlertNotificationComponent } from './components/alert-notification/alert-notification.component';
import { RemoveZerosPipe } from './pipes/remove-zeros.pipe';
import { AlertInfoComponent } from './components/alert-info/alert-info.component';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MigaComponent,
    LoaderComponent,
    AlertNotificationComponent,
    RemoveZerosPipe,
    AlertInfoComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    MigaComponent,
    LoaderComponent,
    AlertNotificationComponent,
    RemoveZerosPipe,
    AlertInfoComponent

  ]
})
export class SharedModule { }
