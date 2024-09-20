import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { MaeicService } from '../../services/maeic.service';
import { Router } from '@angular/router';
import { catchError, delay, of } from 'rxjs';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrl: './actualizar.component.css'
})
export class ActualizarComponent {

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
    console.log(this.myForm.value)
    // this.maeic.validateMaeic(this.myForm.value.nit).pipe(
    //     delay(2500),
    //     catchError(error => {
    //     this.myForm.reset()
    //     return of({ success: false, message: 'error', data:[] });
    //   })


    // ).subscribe(
    //   data=> {
    //     this.isLoading=false
    //     if(data.success){
    //       sessionStorage.setItem('data', JSON.stringify(data.data));
    //       sessionStorage.setItem('tipo', JSON.stringify('CEC'));
    //    return this.router.navigate(['/establecimientos/escoge']);
    //     }else{
    //       if(data.message=='error')
    //      {
    //       return this.router.navigate(['/establecimientos/validar']);
    //     }
    //       sessionStorage.setItem('establecimiento', JSON.stringify([]));
    //       sessionStorage.setItem('nit', JSON.stringify(this.myForm.value.nit));
    //       sessionStorage.setItem('tipo', JSON.stringify('NO-CEC'));
    //       return this.router.navigate(['/establecimientos/registrar']);
    //     }

    //   }
    //);
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
