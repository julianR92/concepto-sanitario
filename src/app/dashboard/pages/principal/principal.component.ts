import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';

@Component({
  selector: 'dashboard-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink:false },
    { label: 'Concepto Sanitario', url:'/', ngLink:true},
    { label: 'Establecimientos', url:'', ngLink:false},

  ];
  public titulo:string = 'TRÁMITE DE CONCEPTO SANITARIO'
  public subitulo :string = 'Alcaldía de Bucaramanga'

  ngOnInit(): void {
    sessionStorage.clear();
  }

}
