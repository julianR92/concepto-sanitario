import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'linea-avance',
  templateUrl: './linea-avance.component.html',
  styleUrl: './linea-avance.component.css'
})
export class LineaAvanceComponent implements OnChanges {

  @Input() step: number = 1;  // Recibe el valor del paso
  progressPercentage: number = 0;

  // Este método se ejecuta cuando el valor de @Input cambia
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['step'] && changes['step'].currentValue) {
      this.updateProgress(changes['step'].currentValue);
    }
  }

  updateProgress(step: number): void {
    // Calcula el porcentaje basado en el paso
    switch (step) {
      case 1:
        this.progressPercentage = 15;
        break;
      case 2:
        this.progressPercentage = 50;
        break;
      case 3:
        this.progressPercentage = 80;
        break;
      case 4:
        this.progressPercentage = 100;
        break;
      default:
        this.progressPercentage = 0;
    }
  }

  isStepActive(step: number): boolean {
    return this.step >= step;  // Activa los pasos anteriores y el actual
  }

}
