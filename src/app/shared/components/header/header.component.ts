import { Component } from '@angular/core';

@Component({
  selector: 'general-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public breadcrumbItems = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/' },
  ];
}
