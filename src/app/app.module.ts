import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//cambiar el local de la app
import localeEs from '@angular/common/locales/es-CO';
import {registerLocaleData} from '@angular/common'
import { SharedModule } from './shared/shared.module';
import { MainModule } from './main/main.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HmacInterceptor } from './interceptors/hmac.interceptors';
import { ErrorInterceptor } from './interceptors/error.interceptors';
import { ToastrModule } from 'ngx-toastr';
import { NgxDocViewerModule } from 'ngx-doc-viewer';


registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MainModule,
    ToastrModule.forRoot(),
    NgxDocViewerModule
  ],
  providers: [
    {provide: LOCALE_ID,useValue:'es-CO'},
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HmacInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }


  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
