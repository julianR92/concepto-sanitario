import { Component, OnInit } from '@angular/core';
import { Fieldset } from 'primeng/fieldset';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  public breadcrumbItems = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/' },
    { label: 'Concepto Sanitario'},

  ];

  public titulo:string = 'TRAMITE DE CONCEPTO SANITARIO'
  public subitulo :string = 'Alcaldía de Bucaramanga'

  ngOnInit(): void {
    sessionStorage.clear();
  }

}
