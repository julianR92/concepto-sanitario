import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'field-buttons',
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css',
})
export class ButtonsComponent {

  constructor(
    private router: Router,
  ) {}

  radicar(): void {
    this.router.navigateByUrl('radicar');
  }
}
