import { Component, Input } from '@angular/core';

@Component({
  selector: 'titulo-tramite',
  templateUrl: './descripcion.component.html',
  styleUrl: './descripcion.component.css'
})
export class DescripcionComponent {

  @Input() public title:string =''
  @Input() public subtitle :string =''

}
