import { Component, OnDestroy } from '@angular/core';
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
import { Visita } from '../../interfaces/Visita.interface';

@Component({
  selector: 'app-informacion-visita',
  templateUrl: './informacion-visita.component.html',
  styleUrl: './informacion-visita.component.css'
})
export class InformacionVisitaComponent implements OnDestroy  {

  public siteKey: string = environments.siteKey;
  public secretKey: string = environments.SECRET_KEY;
  public urlDocuments :string = environments.urlDocuments
  public visita: Visita[] = [];
  public step : number = 0;

  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink: false },
    { label: 'Concepto Sanitario', url: '/', ngLink: true },
    { label: 'Establecimientos', url: '/establecimientos', ngLink: true },
    { label: 'Estado visita', url: '', ngLink: false },
  ];
  public titulo: string = 'TRÁMITE DE CONCEPTO SANITARIO';
  public subitulo: string = 'Estado de la visita';

  public isLoading = false;
  constructor(
    private fb: FormBuilder,
    private vs: ValidatorsService,
    private maeic: MaeicService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.visita = [];
  }
  ngOnInit(): void {
    sessionStorage.clear();
  }

  public myForm: FormGroup = this.fb.group({

    radicado: [
      '',
      [
        Validators.required,
        Validators.minLength(9),
        this.codigoValidator,
      ],
    ],
    recaptcha: ['', Validators.required],
  });

  codigoValidator(control: FormControl) {
    const regex = /^IVC\d{6}-\d+$/;
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
      .getDataVisita(this.myForm.value.radicado)
      .pipe(
        delay(2500),
        catchError((error) => {
          this.myForm.reset();
          return of({ success: false, message: 'error', data: null });
        })
      )
      .subscribe((data) => {
        if (data?.success) {
          if(data.data){
            const visitaData = data.data;
            this.visita = Array.isArray(visitaData) ? visitaData : [visitaData];
            this.isLoading = false;
            if(this.visita[0].status){
              this.step = 3
            }else{
              this.step = 4
            }

          }




        } else {
          this.isLoading = false;
          Swal.fire({
            title: 'Atencion!',
            text: `Visita # ${this.myForm.value?.radicado} no encontrada en el sistema`,
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
