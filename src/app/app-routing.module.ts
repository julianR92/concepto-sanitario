import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './main/pages/principal/principal.component';

const routes: Routes = [

  {
    path: '',
    component: PrincipalComponent,
    pathMatch:'full'
  },
  {
    path: 'establecimientos',
    loadChildren: ()=> import('./dashboard/dashboard.module').then(m=>m.DashboardModule),
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
