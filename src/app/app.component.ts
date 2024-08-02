import { Component, OnInit, signal, Signal } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private primeNgConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;

    // // Establecer los pasos iniciales por defecto
    // const pasos: PasosItems[] = [
    //   { label: 'Inicio', porcentaje: 15 },
    //   { label: 'Hago mi solicitud', porcentaje: 50 },
    //   { label: 'En proceso', porcentaje: 80 },
    //   { label: 'Respuesta', porcentaje: 100 }
    // ];

    // this.lineaAvanceService.setPasos(pasos);
  }

  title = 'Prestamo de planos';
}
