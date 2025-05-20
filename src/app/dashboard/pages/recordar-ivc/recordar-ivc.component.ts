import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { Router } from '@angular/router';
import { environments } from '../../../../environments/environments';
import { QuestionsService } from '../../services/questions.service';
import { catchError, delay, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Empresa, Question } from '../../interfaces/Maeic.interface';
import { Establecimiento } from '../../interfaces/Establecimiento.interface';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-recordar-ivc',
  templateUrl: './recordar-ivc.component.html',
  styleUrl: './recordar-ivc.component.css'
})
export class RecordarIvcComponent implements OnInit {

  public breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink:false },
      { label: 'Concepto Sanitario', url:'/', ngLink:true},
      { label: 'Recordar Inscripcion', url:'', ngLink:false},

    ];

     public titulo:string = 'TRÁMITE DE CONCEPTO SANITARIO'
     public subitulo :string = 'Recordar Numero de Inscripción'
     public siteKey:string = environments.siteKey ;
     public secretKey:string = environments.SECRET_KEY
     public establecimientos: Establecimiento[]=[];
     public questions : Question[] = [];
     public empresa: Empresa[] = [];
     public isLoading = false;

       constructor(
         private fb: FormBuilder,
         private vs: ValidatorsService,
         private preguntas: QuestionsService,
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

         recaptcha: ['', Validators.required],

       });

       public myFormEstablecimiento: FormGroup = this.fb.group({
         establecimiento: [
           '',
           [
             Validators.required,
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
        this.preguntas.validateEstablecimiento(this.myForm.value?.nit).pipe(
            delay(2000),
            catchError(error => {
            this.myForm.reset()
            return of({ success: false, message: 'error', data:[] });
          })


        ).subscribe(
          data=> {
            this.isLoading=false
            if(data?.success){
                this.establecimientos  = data.data as Establecimiento[] ?? [];
                  Swal.fire({
                    title: "Atencion!",
                    text: `Nit: ${this.myForm.value?.nit} validada exitosamente`,
                    icon: "success"
                  });
              // return this.router.navigate(['/establecimientos/actualizarEstablecimiento']);
            }else{
              sessionStorage.clear();
              Swal.fire({
                title: "Atencion!",
                text: `${data?.message}`,
                icon: "warning"
              });
              this.myForm.reset()
              this.establecimientos = [];
              return;

            }

          }
        );
      }
    onSubmitEstablecimiento(): void {
        if (this.myForm.invalid) {
          this.myForm.markAllAsTouched();
          return;
        }
        sessionStorage.clear();
        this.isLoading = true
        let establecimiento = this.myFormEstablecimiento.value?.establecimiento;
        this.preguntas.getDataQuestions(establecimiento).pipe(
            delay(2000),
            catchError(error => {
            this.myForm.reset()
            return of({ success: false, message: 'error', preguntas:[], empresa:[] });
          })


        ).subscribe(
          data=> {
            this.isLoading=false
            if(data?.success){
                sessionStorage.clear();
                this.questions  = data.preguntas as Question[] ?? [];
                const questionData = CryptoJS.AES.encrypt(JSON.stringify(data.preguntas), this.secretKey).toString();
                const empresaData = CryptoJS.AES.encrypt(JSON.stringify(data.empresa), this.secretKey).toString();
                sessionStorage.setItem('questionData', questionData);
                sessionStorage.setItem('empresaData', empresaData);
                return this.router.navigate(['/establecimientos/preguntas-validacion']);



            }else{
              sessionStorage.clear();
              Swal.fire({
                title: "Atencion!",
                text: `${data?.message}`,
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
  isValidFieldEstablecimiento(field: string) {
    return this.vs.isValidField(this.myFormEstablecimiento, field);
  }
  getFieldErrorEstablecimiento(field: string, msj?: string | any) {
    return this.vs.getFieldError(this.myFormEstablecimiento, field, msj);
  }
  getFieldError(field: string, msj?: string | any) {
    return this.vs.getFieldError(this.myForm, field, msj);
  }

}
