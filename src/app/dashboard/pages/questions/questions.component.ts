import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { Data, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environments } from '../../../../environments/environments';
import {
  DataRespuestas,
  DataValidate,
  Empresa,
  Question,
} from '../../interfaces/Maeic.interface';
import * as CryptoJS from 'crypto-js';
import { QuestionsService } from '../../services/questions.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit, OnDestroy {
  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink: false },
    { label: 'Concepto Sanitario', url: '/', ngLink: true },
    {
      label: 'Recordar Inscripcion',
      url: '/establecimientos/recordar-inscripcion',
      ngLink: true,
    },
    { label: 'Preguntas', url: '', ngLink: false },
  ];

  public titulo: string = 'TRÁMITE DE CONCEPTO SANITARIO';
  public subitulo: string = 'Preguntas de Validación';
  public secretKey: string = environments.SECRET_KEY;
  public preguntas: Question[] = [];
  public empresa: Empresa[] = [];
  public dataValidate: DataValidate[] = [];
  public isLoading = false;
  public isSuccess = false;

  constructor(
    private router: Router,
    private questionService: QuestionsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('questionData')) {
      this.router.navigate(['establecimientos/recordar-inscripcion']);
    }
    const questionData = sessionStorage.getItem('questionData');
    //cargar data de bd

    if (questionData) {
      try {
        // Desencripta los datos
        const bytes = CryptoJS.AES.decrypt(questionData, this.secretKey);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.preguntas = data;
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: '¡Error!',
          text: 'Error al descencryptar los datos!',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          sessionStorage.clear();
          this.router.navigate(['establecimientos/recordar-inscripcion']);
        });
      }
    } else {
      console.log('No hay datos almacenados');
    }

    if (!sessionStorage.getItem('empresaData')) {
      this.router.navigate(['establecimientos/recordar-inscripcion']);
    }
    const empresaData = sessionStorage.getItem('empresaData');
    //cargar data de bd

    if (empresaData) {
      try {
        // Desencripta los datos
        const bytes = CryptoJS.AES.decrypt(empresaData, this.secretKey);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.empresa = [data];
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: '¡Error!',
          text: 'Error al descencryptar los datos!',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          sessionStorage.clear();
          this.router.navigate(['establecimientos/recordar-inscripcion']);
        });
      }
    } else {
      console.log('No hay datos almacenados');
    }
  }

  respuestas(respuestas: { name: string; value: string | number }[]) {
    const payload: DataRespuestas = {
      id: this.empresa[0]?.id,
      nit: this.empresa[0]?.nit,
      respuestas: respuestas.map((r) => ({
        campo: r.name,
        valor: r.value,
      })),
    };
    this.sendQuestions(payload);
  }

  sendQuestions(payload: DataRespuestas) {
    this.isLoading = true;
    this.questionService
      .validateRespuestas(payload)
      .pipe(
        delay(2500),
        catchError((error: HttpErrorResponse) => {
          return of({ success: false, message: '', errors: [], data: null });
        })
      )
      .subscribe((response) => {
        if (response.success) {
          this.dataValidate = [response];
          if (
            this.dataValidate.length > 0 &&
            this.dataValidate[0].data &&
            Object.keys(this.dataValidate[0].data).length > 0
          ) {
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
          }

          this.isLoading = false;
          setTimeout(() => {
          this.router.navigate(['/']);

          },30000)


        } else {
          const errors = response.errors ?? [];
          if (errors.length > 0) {
            this.isLoading = false;
            this.showErrorMessages(errors);
            return;
          }
        }
      });
  }

  showErrorMessages(errors: string[]): void {
    errors.forEach((error) => {
      this.toastr.error(error, 'Error');
    });
  }
   ngOnDestroy(): void {
   sessionStorage.clear()
  }

}
