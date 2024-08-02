import { Injectable } from '@angular/core';
import { PasosItems } from '../interfaces/linea-avance.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LineaAvanceService {
  private pasos: PasosItems[] = [
    { label: 'Inicio', porcentaje: 15 },
    { label: 'Hago mi solicitud', porcentaje: 50 },
    { label: 'En proceso', porcentaje: 80 },
    { label: 'Respuesta', porcentaje: 100 },
  ];

  private progresoSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  progreso$ = this.progresoSubject.asObservable();

  setPasos(pasos: PasosItems[]) {
    this.pasos = pasos;
    this.progresoSubject.next(0);
  }

  getPasos(): PasosItems[] {
    return this.pasos;
  }

  setProgreso(progreso: number) {
    if (progreso >= 0 && progreso < this.pasos.length) {
      this.progresoSubject.next(progreso); // Emite el nuevo valor de progreso
    }
  }

  getProgreso(): number {
    return this.progresoSubject.getValue(); // Obtiene el valor actual del progreso
  }

  avanzar() {
    if (this.getProgreso() < this.pasos.length - 1) {
      this.setProgreso(this.getProgreso() + 1); // Avanza al siguiente paso y emite el nuevo valor
    }
  }

  retroceder() {
    if (this.getProgreso() > 0) {
      this.setProgreso(this.getProgreso() - 1); // Retrocede al paso anterior y emite el nuevo valor
    }
  }

  getPorcentaje(): number {
    return this.pasos[this.getProgreso()].porcentaje; // Devuelve el porcentaje del progreso actual
  }

  iniciar(){
    this.progresoSubject.next(0);
  }
}
