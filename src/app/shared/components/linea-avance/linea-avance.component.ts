import { Component, OnInit } from '@angular/core';
import { PasosItems } from '../../interfaces/linea-avance.interface';
import { LineaAvanceService } from '../../services/linea-avance.service';

@Component({
  selector: 'linea-avance',
  templateUrl: './linea-avance.component.html',
  styleUrl: './linea-avance.component.css',
})
export class LineaAvanceComponent implements OnInit {
  pasos: PasosItems[] = [];

  porcentaje: number = 0;

  progreso: number = 0;

  constructor(private lineaAvanceService: LineaAvanceService) {}

  ngOnInit(): void {
    this.pasos = this.lineaAvanceService.getPasos();
    this.lineaAvanceService.progreso$.subscribe((progreso) => {
      this.actualizarEstado(progreso);
    });

    this.actualizarEstado(this.lineaAvanceService.getProgreso());
  }

  private actualizarEstado(progreso: number): void {
    this.progreso = progreso;
    this.porcentaje = this.lineaAvanceService.getPorcentaje();
  }
}
