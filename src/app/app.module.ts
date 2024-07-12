import { LOCALE_ID,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//cambiar el local de la app
import localeEs from '@angular/common/locales/es-CO';
import {registerLocaleData} from '@angular/common'
import { SharedModule } from './shared/shared.module';
import { MainModule } from './main/main.module';
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MainModule
  ],
  providers: [
    {provide: LOCALE_ID,useValue:'es-CO'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
