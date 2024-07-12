import { Component } from '@angular/core';
import { Fieldset } from 'primeng/fieldset';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  public breadcrumbItems = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/' },
    { label: 'Concepto Sanitario'},

  ];

  public titulo:string = 'CONCEPTO SANITARIO'
  public subitulo :string = 'Alcaldía de Bucaramanga'

}
