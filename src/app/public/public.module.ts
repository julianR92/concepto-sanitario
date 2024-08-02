import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { DescripcionComponent } from './descripcion/descripcion.component';
import { DefinicionComponent } from './definicion/definicion.component';
import { AcordionComponent } from './acordion/acordion.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { InformacionComponent } from './informacion/informacion.component';
import { RadicarComponent } from './radicar/radicar.component';

@NgModule({
	declarations: [
		HomeComponent,
		DescripcionComponent,
		DefinicionComponent,
		AcordionComponent,
		ButtonsComponent,
		InformacionComponent,
		RadicarComponent,
	],
	imports: [CommonModule, RouterModule, SharedModule, PrimeNgModule],
})
export class PublicModule {}
