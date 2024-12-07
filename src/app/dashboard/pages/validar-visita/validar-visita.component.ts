import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { MaeicService } from '../../services/maeic.service';
import { Router } from '@angular/router';
import { catchError, delay, of } from 'rxjs';
import { environments } from '../../../../environments/environments';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-validar-visita',
  templateUrl: './validar-visita.component.html',
  styleUrl: './validar-visita.component.css',
})
export class ValidarVisitaComponent {
  public siteKey: string = environments.siteKey;
  public secretKey: string = environments.SECRET_KEY;

  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink: false },
    { label: 'Concepto Sanitario', url: '/', ngLink: true },
    { label: 'Establecimientos', url: '/establecimientos', ngLink: true },
    { label: 'Validar Visita', url: '', ngLink: false },
  ];
  public titulo: string = 'TRÁMITE DE CONCEPTO SANITARIO';
  public subitulo: string = 'Solicitar Visita';

  public isLoading = false;
  constructor(
    private fb: FormBuilder,
    private vs: ValidatorsService,
    private maeic: MaeicService,
    private router: Router
  ) {}
  ngOnInit(): void {
    sessionStorage.clear();
  }

  public myForm: FormGroup = this.fb.group({
    nit: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(12),
        Validators.pattern(this.vs.numberPattern),
      ],
    ],
    inscripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        this.codigoValidator,
      ],
    ],
    recaptcha: ['', Validators.required],
  });

  codigoValidator(control: FormControl) {
    const regex = /^IVC\d{6}$/;
    const valid = regex.test(control.value);
    return valid ? null : { notFormat: true };
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    sessionStorage.clear();
    this.isLoading = true;
    this.maeic
      .getIdEstablemiento(this.myForm.value?.nit, this.myForm.value.inscripcion)
      .pipe(
        delay(2500),
        catchError((error) => {
          this.myForm.reset();
          return of({ success: false, message: 'error', data: null });
        })
      )
      .subscribe((data) => {
        if (data?.success) {
          let establecimiento_id = data?.data?.id.toString();
          if (establecimiento_id) {
            this.maeic
              .validateAutoEvaluacionById(establecimiento_id)
              .pipe(
                catchError((error) => {
                  this.myForm.reset();
                  return of({ success: false, message: 'error', data: null });
                })
              )
              .subscribe((data) => {
                if (data?.success) {
                  this.maeic
                    .validateVisita(establecimiento_id)
                    .pipe(
                      catchError((error) => {
                        this.myForm.reset();
                        return of({
                          success: false,
                          message: 'error',
                          data: null,
                        });
                      })
                    )
                    .subscribe((data) => {
                      if (!data?.success) {

                  sessionStorage.clear();
                  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(establecimiento_id), this.secretKey).toString();
                  sessionStorage.setItem('encryptedData', encryptedData);
                    Swal.fire({
                      title: "Atencion!",
                      text: `Inscripcion: ${this.myForm.value.inscripcion} validada exitosamente`,
                      icon: "success"
                    });
                    return this.router.navigate(['/establecimientos/visita']);

                      } else {
                        this.isLoading = false;
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: `${data?.message}`,
                        });
                        return;
                      }
                    });
                } else {
                  this.isLoading = false;
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Antes de solicitar la visita, debes completar la autoevaluación',
                  });
                  return;
                }
              });
          } else {
            console.error('Establecimiento ID es indefinido');
          }


        } else {
          this.isLoading = false;
          sessionStorage.clear();
          Swal.fire({
            title: 'Atencion!',
            text: `Inscripcion: ${this.myForm.value?.inscripcion} no encontrada para el nit ${this.myForm.value?.nit}`,
            icon: 'warning',
          });
          this.myForm.reset();
          return;
        }
      });
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    return this.vs.onlyNumbers(event);
  }
  toUpperCase(event: Event): string {
    return this.vs.toUpper(event);
  }

  isValidField(field: string) {
    return this.vs.isValidField(this.myForm, field);
  }
  getFieldError(field: string, msj?: string | any) {
    return this.vs.getFieldError(this.myForm, field, msj);
  }
}
