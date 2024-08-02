import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { RadicarComponent } from './public/radicar/radicar.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full',
	},
	{
		path: 'home',
		component: HomeComponent,
		pathMatch: 'full',
	},
	{
		path: 'radicar',
		component: RadicarComponent,
		pathMatch: 'full',
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
