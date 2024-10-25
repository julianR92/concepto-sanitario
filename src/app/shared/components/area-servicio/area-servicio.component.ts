import { Component, Input } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'area-servicio',
  templateUrl: './area-servicio.component.html',
  styleUrl: './area-servicio.component.css'
})
export class AreaServicioComponent {
  @Input() urlManual: string = '';
  @Input() tramite: string = '';


  constructor(private request: RequestService) {}
  onEasyClick(): void {
    this.request.experienciaUser('FACIL',this.tramite).subscribe(response => {
      if(response?.success){
        this.showSuccessAlert();
      }
    });
  }

  onHardClick(): void {
    this.request.experienciaUser('DIFICIL', this.tramite).subscribe(response => {
      if(response?.success){
        this.showSuccessAlert();
      }
    });
  }

  showSuccessAlert(): void {
    const alert = document.getElementById('alerta-service');
    if (alert) {
      alert.style.display = 'block';

      setTimeout(() => {
        alert.style.display = 'none';
      }, 5000);
    }
  }

}
