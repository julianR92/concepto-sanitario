import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrl: './validar.component.css'
})
export class ValidarComponent {
  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink:false },
    { label: 'Concepto Sanitario', url:'/', ngLink:true},
    { label: 'Validar', url:'', ngLink:false},

  ];
  public titulo:string = 'TRAMITE DE CONCEPTO SANITARIO'
  public subitulo :string = 'Alcaldía de Bucaramanga'

}
