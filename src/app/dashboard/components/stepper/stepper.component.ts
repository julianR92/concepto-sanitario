import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../interfaces/Maeic.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
})
export class StepperComponent implements OnDestroy, OnInit {
  @Input() preguntas: Question[] = [];
  @Output() respuestas = new EventEmitter<{ name: string, value: string | number }[]>();


  respuestasUsuario: { name: string; value: string | number }[] = [];
   tiempoRestante: number = 180; // 3 minutos
  intervalo: any
  activeStep = 1;


  constructor(private router: Router) {}
  ngOnDestroy(): void {
    clearInterval(this.intervalo);

  }
  ngOnInit(): void {
    this.respuestasUsuario = this.preguntas.map((p) => ({
      name: p.opciones[0]?.campo || '',
      value: '',
    }));

    this.preguntas = this.preguntas.sort(() => Math.random() - 0.5);
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        clearInterval(this.intervalo);
        this.router.navigate(['/']); // Cambia la ruta según tu app
      }
    }, 1000);
  }

  setRespuesta(index: number, name: string, value: string | number) {
    this.respuestasUsuario[index] = { name, value };
  }

  cambiarPaso(index: number) {
    this.activeStep = index;
  }
  get tiempoFormateado(): string {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    return `${this.agregarCero(minutos)}:${this.agregarCero(segundos)}`;
  }
   agregarCero(valor: number): string {
    return valor < 10 ? '0' + valor : valor.toString();
  }


  enviar() {
    clearInterval(this.intervalo);
    this.respuestas.emit(this.respuestasUsuario);
  }


}
