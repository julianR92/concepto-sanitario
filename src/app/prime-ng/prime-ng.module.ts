import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';






@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    MenuModule,
    MenubarModule,
    CardModule
  ]
})
export class PrimeNgModule { }
