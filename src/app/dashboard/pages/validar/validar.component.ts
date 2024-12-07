import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { HttpClient } from '@angular/common/http';
import { MaeicService } from '../../services/maeic.service';
import { catchError, delay, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrl: './validar.component.css',
})
export class ValidarComponent  implements OnInit{
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

  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink: false },
    { label: 'Concepto Sanitario', url: '/', ngLink: true },
    { label: 'Validar', url: '', ngLink: false },
  ];
  public titulo: string = 'TRÁMITE DE CONCEPTO SANITARIO';
  public subitulo: string = 'Alcaldía de Bucaramanga';

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
  });

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    sessionStorage.clear();
    this.isLoading = true
    this.maeic.validateMaeic(this.myForm.value.nit).pipe(
        delay(2500),
        catchError(error => {
        this.myForm.reset()
        return of({ success: false, message: 'error', data:[] });
      })


    ).subscribe(
      data=> {
        this.isLoading=false
        if(data.success){
          sessionStorage.setItem('data', JSON.stringify(data.data));
          sessionStorage.setItem('tipo', JSON.stringify('CEC'));
       return this.router.navigate(['/establecimientos/escoge']);
        }else{
          if(data.message=='error')
         {
          return this.router.navigate(['/establecimientos/validar']);
        }
          sessionStorage.setItem('establecimiento', JSON.stringify([]));
          sessionStorage.setItem('nit', JSON.stringify(this.myForm.value.nit));
          sessionStorage.setItem('tipo', JSON.stringify('NO-CEC'));
          return this.router.navigate(['/establecimientos/registrar']);
        }

      }
    );
  }

  onlyNumbers(event: KeyboardEvent):boolean{
   return this.vs.onlyNumbers(event);
  }

  isValidField(field: string) {
    return this.vs.isValidField(this.myForm, field);
  }
  getFieldError(field: string, msj?: string | any) {
    return this.vs.getFieldError(this.myForm, field, msj);
  }
}
