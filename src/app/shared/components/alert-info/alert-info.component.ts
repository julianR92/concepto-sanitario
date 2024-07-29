import { Component, Input } from '@angular/core';

@Component({
  selector: 'alert-info',
  templateUrl: './alert-info.component.html',
  styleUrl: './alert-info.component.css'
})
export class AlertInfoComponent {
  @Input() message: string = '';

}
