import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';











@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    MenuModule,
    MenubarModule,
    CardModule,
    FieldsetModule,
    AvatarGroupModule,
    AvatarModule,
    FileUploadModule,
    DropdownModule



  ]
})
export class PrimeNgModule { }
