import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { MaeicService } from '../../services/maeic.service';
import { Router } from '@angular/router';
import { catchError, delay, of } from 'rxjs';
import { environments } from '../../../../environments/environments';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrl: './actualizar.component.css'
})
export class ActualizarComponent {

  public siteKey:string = environments.siteKey ;
  public secretKey:string = environments.SECRET_KEY

  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink:false },
    { label: 'Concepto Sanitario', url:'/', ngLink:true},
    { label: 'Establecimientos', url:'/establecimientos', ngLink:true},
    { label: 'Actualizar', url:'', ngLink:false},

  ];
  public titulo:string = 'TRAMITE DE CONCEPTO SANITARIO'
  public subitulo :string = 'Alcaldía de Bucaramanga'

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
    this.isLoading = true
    this.maeic.getIdEstablemiento(this.myForm.value?.nit,this.myForm.value.inscripcion).pipe(
        delay(2000),
        catchError(error => {
        this.myForm.reset()
        return of({ success: false, message: 'error', data:[] });
      })


    ).subscribe(
      data=> {
        this.isLoading=false
        if(data?.success){

          sessionStorage.clear();
          const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data.data), this.secretKey).toString();
          sessionStorage.setItem('encryptedData', encryptedData);
          Swal.fire({
            title: "Atencion!",
            text: `Inscripcion: ${this.myForm.value.inscripcion} validada exitosamente`,
            icon: "success"
          });
          return this.router.navigate(['/establecimientos/actualizarEstablecimiento']);
        }else{
          sessionStorage.clear();
          Swal.fire({
            title: "Atencion!",
            text: `Inscripcion: ${this.myForm.value?.inscripcion} no encontrada para el nit ${this.myForm.value?.nit}`,
            icon: "warning"
          });
          this.myForm.reset()
          return;

        }

      }
    );
  }

  onlyNumbers(event: KeyboardEvent):boolean{
   return this.vs.onlyNumbers(event);
  }
  toUpperCase(event: Event):string{
   return this.vs.toUpper(event);
  }

  isValidField(field: string) {
    return this.vs.isValidField(this.myForm, field);
  }
  getFieldError(field: string, msj?: string | any) {
    return this.vs.getFieldError(this.myForm, field, msj);
  }

}
