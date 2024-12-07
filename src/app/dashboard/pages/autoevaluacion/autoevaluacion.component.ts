import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataValidate, ResponseSucesss } from '../../interfaces/Maeic.interface';
import { Router } from '@angular/router';
import { environments } from '../../../../environments/environments';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { MaeicService } from '../../services/maeic.service';
import { catchError, delay, distinctUntilChanged, map, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-autoevaluacion',
  templateUrl: './autoevaluacion.component.html',
  styleUrl: './autoevaluacion.component.css'
})
export class AutoevaluacionComponent implements  OnInit {
  public secretKey:string = environments.SECRET_KEY
  public siteKey :string = environments.siteKey
  public dataStore: ResponseSucesss[]= [];
  public dataValidate: any|null= null;
  public dataFinaliza: any|null= null;
  public establecimiento: any|null = null;
  public isLoading: boolean = false;
  docUrl = "https://saneamiento.bucaramanga.gov.co/assets/documentos/autoevaluacion/acta-general-inspeccion-vigilancia-y-control.xls";
    // Aquí puedes cambiar la URL del documento


  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink:false },
    { label: 'Concepto Sanitario', url:'/', ngLink:true},
    { label: 'Establecimientos', url:'/establecimientos', ngLink:true},
    { label: 'Auto Evaluacion', url:'', ngLink:false},

  ];
  public titulo:string = 'TRÁMITE DE CONCEPTO SANITARIO'
  public subitulo :string = 'Auto-Evaluación'

  constructor( private router: Router, private maeic: MaeicService,private toastr: ToastrService,  private fb: FormBuilder,
    private vs: ValidatorsService,){}


  ngOnInit(): void {


    if (!sessionStorage.getItem('encryptedData')) {
      this.router.navigate(['/establecimientos']);
    }
    const encryptedData = sessionStorage.getItem('encryptedData');   //cargar data de bd



    if (encryptedData) {
      try {
        // Desencripta los datos
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.getDatabyId(data.id);


      } catch (error) {
        console.log(error)
        Swal.fire({
          title: '¡Error!',
          text: 'Error al descencryptar los datos!',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          sessionStorage.clear();
          this.router.navigate(['/establecimientos/actualizar']);
        });
      }
    } else {
      console.log('No hay datos almacenados');
    }



  }


   public myForm: FormGroup = this.fb.group({
    id: ['', Validators.required],
    nit: ['', [Validators.required]],
    criterios: ['',    [Validators.requiredTrue]],
    recaptcha: ['', Validators.required],
    inscripcion : ['', Validators.required]
  });

   getDatabyId(id:string){
    this.maeic.getEstablecimientobyId(id).pipe(
      delay(500),
      catchError(error => {
      return of({ data:[] });
    })


  ).subscribe(
    data=>{
      if(data){
        this.establecimiento = data
        this.maeic.validateAutoEvaluacionById(this.establecimiento.id).pipe(
          catchError(error => {
            return of({ data:[] });
          })
        ).subscribe(datos=>{
          this.dataValidate = datos
          if(this.dataValidate.success){
            sessionStorage.clear();
            this.dataFinaliza ={
                id: this.establecimiento.id,
                inscripcion: this.establecimiento.inscripcion,
                nit: this.establecimiento.nit,
                razon_social: this.establecimiento.razon_social,
                direccion: this.establecimiento.direccion,
                complemento_direccion: this.establecimiento.complemento_direccion,
                mensaje: 'Ya has realizado tu auto-evaluación',

            }
            console.log(this.dataFinaliza)
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(this.dataFinaliza), this.secretKey).toString();
            sessionStorage.setItem('encryptedData', encryptedData);
            this.router.navigate(['/establecimientos/autoevaluacion-finalizada']);

          }else{
            this.loadEstablecimiento()
          }
        })
      }else{
        this.toastr.error('Se presento un error al cargar los datos intente mas tarde', 'Error');
        this.router.navigate(['/establecimientos/actualizar']);
      }
    }
  )
   }


  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }



    Swal.fire({
      title: '¿Estas seguro de guardar tu auto-evaluacion?',
      text: `No podras volver a realizarla`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si!. Continuar',
      cancelButtonText: 'No,cancelar',
      customClass: {
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true
      this.maeic.autoEvaluacion(this.myForm.value).
     pipe(
      delay(2500),
      catchError((error: HttpErrorResponse) => {
               return of({ success: false, errors: [] } as DataValidate);
      })).
    subscribe(response=>{
        if(response.success){

          Swal.fire({
            title: 'Proceso Exitoso!',
            text: 'Auto-Evaluación Procesada Exitosamente!',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            this.isLoading = false
            sessionStorage.clear();
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(response.data), this.secretKey).toString();
            sessionStorage.setItem('encryptedData', encryptedData);

            this.router.navigate(['/establecimientos/autoevaluacion-finalizada']);
          });

        }else{
          const errors = response.errors ?? []
          if(errors.length>0){
            this.isLoading = false
           this.showErrorMessages(errors)
           return;

          }

        }

    }
    );

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });


  }

  loadEstablecimiento(){
   //cargar datos en el form
   this.myForm.patchValue({
    nit: this.establecimiento?.nit,
    id : this.establecimiento?.id,
    inscripcion : this.establecimiento?.inscripcion,



  });

  }





  //////////
  isValidField(field: string) {
    return this.vs.isValidField(this.myForm, field);
  }
  getFieldError(field: string, msj?: string | any) {
    return this.vs.getFieldError(this.myForm, field, msj);
  }
  onlyNumbers(event: KeyboardEvent): boolean {
    return this.vs.onlyNumbers(event);
  }
  onlyLetters(event: KeyboardEvent): boolean {
    return this.vs.onlyLetters(event);
  }
  showErrorMessages(errors: string[]): void {
    errors.forEach(error => {
      this.toastr.error(error, 'Error');
    });
  }
}
