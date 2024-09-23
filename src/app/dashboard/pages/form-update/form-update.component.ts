import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResponseSucesss } from '../../interfaces/Maeic.interface';
import { Router } from '@angular/router';
import { environments } from '../../../../environments/environments';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { MaeicService } from '../../services/maeic.service';
import { catchError, delay, distinctUntilChanged, map, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Establecimiento } from '../../interfaces/Establecimiento.interface';
import { ActividadEconomica, Barrio, CodigoCiiu, Comuna, Corregimiento, Departamento, Municipio, Parametro } from '../../interfaces/Options.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';


@Component({
  selector: 'app-form-update',
  templateUrl: './form-update.component.html',
  styleUrl: './form-update.component.css'
})
export class FormUpdateComponent implements OnInit, OnDestroy {

  public secretKey:string = environments.SECRET_KEY
  public siteKey :string = environments.siteKey
  public dataStore: ResponseSucesss[]= [];
  public establecimiento: any|null = null;
  public departamentos: Departamento[] = [];
  public municipios: Municipio[] = [];
  public corregimientos: Corregimiento[] = [];
  public actividades: ActividadEconomica[] = [];
  public ciiu: CodigoCiiu[] = [];
  public barrios: Barrio[] = [];
  public letras: Parametro[] = [];
  public indicaciones: Parametro[] = [];
  public comuna: Comuna | null = null;
  public isLoading: boolean = false;

  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink:false },
    { label: 'Concepto Sanitario', url:'/', ngLink:true},
    { label: 'Establecimientos', url:'/establecimientos', ngLink:true},
    { label: 'Actualizar', url:'/establecimientos/actualizar', ngLink:true},
    { label: 'Formulario', url:'', ngLink:false},

  ];
  public titulo:string = 'TRAMITE DE CONCEPTO SANITARIO'
  public subitulo :string = 'Alcaldía de Bucaramanga'

  constructor( private router: Router, private maeic: MaeicService,private toastr: ToastrService,  private fb: FormBuilder,
    private vs: ValidatorsService,){}


  ngOnInit(): void {


    if (!sessionStorage.getItem('encryptedData')) {
      this.router.navigate(['/establecimientos/actualizar']);
    }
    const encryptedData = sessionStorage.getItem('encryptedData');
    //cargar data de bd
    this.loadOptions();
     //funcion direccion
     this.OnDireccionChanged();

    this.myForm.get('barrio')?.valueChanges.pipe(
      tap(()=> this.myForm.get('comuna')?.setValue('')),
    ).subscribe((barrio) => {
       this.onchagedBarrio(barrio)
    })
    this.myForm.get('departamento_notificacion')?.valueChanges.pipe(
      tap(()=> this.myForm.get('municipio_notificacion')?.setValue('')),
      map(departamento => {
        return this.searchDeparmentByName(departamento) ?? '';
      })
    ).subscribe((departamento_id) => {
      if(!departamento_id) return ;
        this.onChangedDepartamento(departamento_id)
    })
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

  get letters() {
    return this.letras;
  }
  get calles() {
    return this.indicaciones;
  }
  get departamentosFull() {
    return this.departamentos;
  }

  ngOnDestroy(): void {
    sessionStorage.clear()
   }

   public myForm: FormGroup = this.fb.group({
    id: ['', Validators.required],
    nit: ['', [Validators.required]],
    tipo: ['', [Validators.required]],
    razon_social: [
      '',
      [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(this.vs.razonSocialPattern),
      ],
    ],
    nombre_comercial: [
      '',
      [Validators.maxLength(100), Validators.pattern(this.vs.numberStringPattern)],
    ],
    registro_iyc: [
      '',
      [Validators.maxLength(7), Validators.pattern(this.vs.numberPattern)],
    ],
    matricula_mercantil: [
      '',
      [Validators.maxLength(15), Validators.pattern(this.vs.numberPattern)],
    ],
    direccion_maeic: ['', []],
    numero_predial: ['', []],
    actividad_economica: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7),Validators.pattern(this.vs.numberPattern)]],
    correo_electronico: ['', [Validators.required, Validators.pattern(this.vs.emailPattern)]],
    confirme_email: ['', [Validators.required, Validators.pattern(this.vs.emailPattern)]],
    calle: ['', []],
    numero_nombre: [
      '',
      [
        Validators.pattern(this.vs.numberStringPattern),
        Validators.maxLength(10),
      ],
    ],
    numero_uno: [
      '',
      [
        Validators.pattern(this.vs.numberPattern),
        Validators.maxLength(3),
      ],
    ],
    numero_dos: [
      '',
      [Validators.pattern(this.vs.numberPattern), Validators.maxLength(3)],
    ],
    letra_uno: ['', []],
    letra_dos: ['', []],
    letra_tres: ['', []],
    direccion: ['', []],
    complemento_direccion: ['', [Validators.pattern(this.vs.numberStringPattern), Validators.maxLength(100)]],
    barrio: ['', [Validators.required]],
    comuna: ['', [Validators.required]],
    corregimiento: ['', []],
    municipio: ['Bucaramanga', [Validators.required]],
    departamento: ['Santander', [Validators.required]],
    nom_propietario: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(this.vs.letterPAttern)]],
    ape_propietario: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(this.vs.letterPAttern)]],
    tipo_documento_pro: ['', [Validators.required]],
    documento_propietario: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(this.vs.numberPattern)]],
    nom_representante: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(this.vs.letterPAttern)]],
    ape_representante: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(this.vs.letterPAttern)]],
    tipo_documento_repre: ['', [Validators.required]],
    documento_repre: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(this.vs.numberPattern)]],
    correo_representante: ['', [Validators.pattern(this.vs.emailPattern)]],
    direccion_notificacion: ['', [Validators.pattern(this.vs.addressPattern), Validators.maxLength(100)]],
    departamento_notificacion: ['', []],
    municipio_notificacion: ['', []],
    autoriza_notificaciones: ['1', [Validators.required]],
    id_ciuu : ['', []],
    numero_trabajadores : ['', [Validators.maxLength(5), Validators.pattern(this.vs.numberPattern)]],
    horario : ['', [Validators.maxLength(150), Validators.pattern(this.vs.mulitplePattern)]],
    recaptcha: ['', Validators.required],
    direccion_actual : ['', Validators.required]


  }, {
    validators: [
      this.vs.isFieldOneEqualFieldTwo('correo_electronico','confirme_email')
    ]
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
        this.loadEstablecimiento()
      }else{
        this.toastr.error('Se presento un error al cargar los datos intente mas tarde', 'Error');
        this.router.navigate(['/establecimientos/actualizar']);
      }
    }
  )
   }

   public loadOptions() {
    this.maeic
      .getOptions()
      .pipe(
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data === null) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Lo sentimos No se han podido cargar los datos correctamente intentelo mas tarde',
          });
          return this.router.navigate(['/establecimientos/actualizar']);
        } else {
          this.actividades = data.actividades;
          this.departamentos = data.departamentos;
          this.corregimientos = data.corregimiento;
          this.ciiu = data.ciiu;
          this.barrios = data.barrios;
          this.letras = data.letras;
          this.indicaciones = data.indicaciones;
          return;
        }
      });
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.establecimiento = this.myForm.value;



    // //realizar peticion
    // this.isLoading = true
    // this.maeic.addEstablecimiento(this.establecimiento).
    //  pipe(
    //   delay(2500),
    //   catchError((error: HttpErrorResponse) => {
    //            return of({ success: false, errors: [] } as DataValidate);
    //   })).
    // subscribe(response=>{
    //     if(response.success){

    //       Swal.fire({
    //         title: '¡Registro Exitoso!',
    //         text: 'Establecimiento Registrado Exitosamente!',
    //         icon: 'success',
    //         timer: 3000,
    //         showConfirmButton: false
    //       }).then(() => {
    //         this.isLoading = false
    //         sessionStorage.clear();
    //         const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(response.data), this.secretKey).toString();
    //         sessionStorage.setItem('encryptedData', encryptedData);

    //         this.router.navigate(['/establecimientos/finaliza']);
    //       });

    //     }else{
    //       const errors = response.errors ?? []
    //       if(errors.length>0){
    //         this.isLoading = false
    //        this.showErrorMessages(errors)
    //        return;

    //       }

    //     }

    // }
    // );
  }

  loadEstablecimiento(){
   //cargar datos en el form
   this.myForm.patchValue({
    nit: this.establecimiento?.nit,
    tipo: this.establecimiento?.tipo,
    razon_social: this.establecimiento?.razon_social,
    matricula_mercantil: this.establecimiento?.matricula_mercantil,
    registro_iyc: this.establecimiento?.registro_iyc,
    nombre_comercial: this.establecimiento?.nombre_comercial,
    direccion_maeic: this.establecimiento?.direccion_maeic,
    numero_predial: this.establecimiento?.numero_predial,
    direccion_actual: this.establecimiento?.direccion,
    complemento_direccion: this.establecimiento?.complemento_direccion,
    telefono: this.establecimiento?.telefono,
    actividad_economica: this.establecimiento?.actividad_id,
    correo_electronico: this.establecimiento?.correo_electronico,
    confirme_email: this.establecimiento?.correo_electronico,
    barrio: this.establecimiento?.barrio,
    comuna: this.establecimiento?.comuna,
    corregimiento: this.establecimiento?.corregimiento|| '',
    nom_propietario: this.establecimiento?.nom_propietario,
    ape_propietario: this.establecimiento?.ape_propietario,
    tipo_documento_pro: this.establecimiento?.tipo_documento_pro,
    documento_propietario: this.establecimiento?.documento_propietario,
    nom_representante: this.establecimiento?.nom_representante,
    ape_representante: this.establecimiento?.ape_representante,
    tipo_documento_repre: this.establecimiento?.tipo_documento_repre,
    documento_repre: this.establecimiento?.documento_repre,
    correo_representante: this.establecimiento?.correo_representante,
    direccion_notificacion: this.establecimiento?.direccion_notificacion,
    autoriza_notificaciones: this.establecimiento?.autoriza_notificaciones.toString(),
    id_ciuu : this.establecimiento?.id_ciuu,
    departamento_notificacion : this.establecimiento?.departamento_notificacion,
    municipio_notificacion : this.establecimiento?.municipio_notificacion,
    horario : this.establecimiento?.horario,
    numero_trabajadores : this.establecimiento?.numero_trabajadores,
    id : this.establecimiento?.id,



  });

  }

  searchDeparmentByName(nombre: string): string | null {
    const departamento = this.departamentos.find(depto => depto.departamento === nombre);
  if (departamento) {
    const codigo = departamento.codigo_depto.toString().padStart(2, '0');
    return codigo;
  }
  return null
  }
  onchagedBarrio(barrio:string):void {
    this.maeic.getComunaByBarrio(barrio).subscribe(data=>{
      if (data) {
        this.comuna = data[0] ?? null;
        this.myForm.get('comuna')?.setValue(this.comuna.codigo);

      } else {
        this.comuna = null;
      }
  })
}
onChangedDepartamento(departamento_id:string): void {
  this.maeic.getMunicipiosbyId(departamento_id).subscribe(data=>    {
    if(Array.isArray(data)){
      this.municipios= data
    }else{
      this.municipios = []
    }

})
}
OnDireccionChanged(): void {
  this.myForm.valueChanges.pipe(
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))

  ).subscribe(() => {
    this.concatenarDireccion();
  });
}
concatenarDireccion(): void {
  const {
    calle,
    numero_nombre,
    numero_uno,
    numero_dos,
    letra_uno,
    letra_dos,
    letra_tres,
  } = this.myForm.value;
  const direccionCompleta = `${calle} ${numero_nombre.toUpperCase()} ${letra_uno} # ${numero_uno}${letra_dos} - ${numero_dos}${letra_tres}`;
  this.myForm.get('direccion')?.setValue(direccionCompleta, {emitEvent:false});
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
