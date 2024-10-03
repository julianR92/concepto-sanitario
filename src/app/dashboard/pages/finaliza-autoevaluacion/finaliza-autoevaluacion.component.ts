import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environments } from '../../../../environments/environments';
import { ResponseSucesss } from '../../interfaces/Maeic.interface';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finaliza-autoevaluacion',
  templateUrl: './finaliza-autoevaluacion.component.html',
  styleUrl: './finaliza-autoevaluacion.component.css'
})
export class FinalizaAutoevaluacionComponent implements OnDestroy, OnInit {
  public secretKey:string = environments.SECRET_KEY
  public dataStore: ResponseSucesss[]= [];
  constructor( private router: Router){}


  ngOnInit(): void {
    if (!sessionStorage.getItem('encryptedData')) {
      this.router.navigate(['/']);
    }
    const encryptedData = sessionStorage.getItem('encryptedData');

    if (encryptedData) {
      try {
        // Desencripta los datos
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.dataStore=[
          {
            id: data.id,
            inscripcion: data.inscripcion,
            nit: data.nit,
            razon_social: data.razon_social,
            direccion: data.direccion,
            complemento_direccion: data.complemento_direccion,
            mensaje: data.mensaje,
          }
        ]
        console.log(this.dataStore)

      } catch (error) {
        Swal.fire({
          title: '¡Error!',
          text: 'Error al descencryptar los datos!',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          sessionStorage.clear();
          this.router.navigate(['/']);
        });
      }
    } else {
      console.log('No hay datos almacenados');
    }

  }
  ngOnDestroy(): void {
   sessionStorage.clear()
  }
}
