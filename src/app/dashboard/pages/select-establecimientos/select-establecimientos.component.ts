import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { Router } from '@angular/router';
import { Maeic } from '../../interfaces/Maeic.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { MaeicService } from '../../services/maeic.service';
import { catchError, delay, of } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-select-establecimientos',
  templateUrl: './select-establecimientos.component.html',
  styleUrl: './select-establecimientos.component.css'
})
export class SelectEstablecimientosComponent implements OnInit {

  public dataCec: Maeic[] = [];
  public establecimiento: Maeic[]=[];
  public MaeNum :string = ''
  public MaeProCod :string = ''
  public MaeDir :string|undefined = ''
  public isLoading: boolean = false;
  public isExist: boolean= false;
  public messajeAlert: string = ''

  constructor(private router: Router,  private fb: FormBuilder,
              private vs: ValidatorsService,
              private maeic: MaeicService,
  ){}
  ngOnInit(): void {
    if(!sessionStorage.getItem('data')){
      this.router.navigate(['/establecimientos/validar'])
    }
    this.loadDataFromSessionStorage();

  }
  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink: false },
    { label: 'Concepto Sanitario', url: '/', ngLink: true },
    { label: 'Validar', url: '/establecimientos/validar', ngLink: true },
    { label: 'Escoge', url: '', ngLink: true },
  ];
  public titulo: string = 'TRAMITE DE CONCEPTO SANITARIO';
  public subitulo: string = 'Escoge tu establecimiento';

  public myForm: FormGroup = this.fb.group({
    placa: [
      '',
      [
        Validators.required,

      ],
    ],
  });

  get dataEstblecimentos(): Maeic[]{
    return this.dataCec;
  }



  private loadDataFromSessionStorage(): void {
    const data = sessionStorage.getItem('data');

    if (data) {
      try {
        this.dataCec = JSON.parse(data);
      } catch (e) {
        console.error('Error al analizar JSON del sessionStorage:', e);
        this.dataCec = [];
      }
    } else {
      this.dataCec = [];
    }
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.establecimiento = this.dataEstblecimentos.filter(el=> el.MaeNum === this.myForm.value.placa)
    this.MaeNum = this.establecimiento[0].MaeNum
    this.MaeDir = this.establecimiento[0].MaeDir
    this.MaeProCod = this.establecimiento[0].MaeProCod
    sessionStorage.removeItem('establecimiento');
    this.isLoading = true
     this.maeic.validateEstablecimiento(this.MaeProCod,this.myForm.value.placa)
     .pipe(
      delay(2500),
      catchError(error => {
      this.myForm.reset()
      return of({ success: true, message: 'error'});
    })
     )
     .subscribe(data=>
     {
      if(!data.success){

        sessionStorage.removeItem('data')
        sessionStorage.setItem('establecimiento', JSON.stringify(this.establecimiento));
        return this.router.navigate(['/establecimientos/registrar']);
      }else{
        if(data.message=='error')
          {
           return this.router.navigate(['/establecimientos/validar']);
          }
          this.isLoading = false
          this.messajeAlert = `El establecimiento con nit: ${this.vs.removeLeadingZeros(this.MaeProCod)} con sede en : ${this.MaeDir} ya se encuentra registrado`
          Swal.fire({
            title: "Atencion!",
            text: this.messajeAlert,
            icon: "warning"
          });
          this.myForm.setValue({'placa':''});
          this.myForm.get('placa')?.clearValidators()
          this.myForm.get('placa')?.updateValueAndValidity()


          this.isExist= true;
          this.MaeNum = '';
          this.MaeDir = '';
          this.MaeNum = '';

           return ;

      }
    }
     );



  }

  isValidField(field: string) {
    return this.vs.isValidField(this.myForm, field);
  }
  getFieldError(field: string, msj?: string | any) {
    return this.vs.getFieldError(this.myForm, field, msj);
  }



}
