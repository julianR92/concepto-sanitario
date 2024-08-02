import { BreadcrumbItem } from './../../interfaces/miga.interface';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'general-miga',
  templateUrl: './miga.component.html',
  styleUrl: './miga.component.css'
})

export class MigaComponent {
  @Input() items: BreadcrumbItem[] = [];
}
