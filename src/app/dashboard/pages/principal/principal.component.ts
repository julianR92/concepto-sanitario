import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';

@Component({
  selector: 'dashboard-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink:false },
    { label: 'Concepto Sanitario', url:'/', ngLink:true},
    { label: 'Establecimientos', url:'', ngLink:false},

  ];
  public titulo:string = 'TRAMITE DE CONCEPTO SANITARIO'
  public subitulo :string = 'Alcaldía de Bucaramanga'

}
