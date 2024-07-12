import { Component } from '@angular/core';

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

}
