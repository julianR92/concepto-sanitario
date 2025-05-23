import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { DataValidate, Maeic } from '../../interfaces/Maeic.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import {
  ActividadEconomica,
  Barrio,
  CodigoCiiu,
  Comuna,
  Corregimiento,
  Departamento,
  Municipio,
  Parametro,
} from '../../interfaces/Options.interface';
import { MaeicService } from '../../services/maeic.service';
import { catchError, delay, distinctUntilChanged, map, of, tap } from 'rxjs';
import { environments } from '../../../../environments/environments';
import { Establecimiento } from '../../interfaces/Establecimiento.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css',
})
export class CrearComponent implements OnInit {
  public message: string = '';
  public nit: string | null = null;
  public tipo: string | null = null;
  public dataCec: Maeic[] = [];
  public departamentos: Departamento[] = [];
  public municipios: Municipio[] = [];
  public corregimientos: Corregimiento[] = [];
  public actividades: ActividadEconomica[] = [];
  public ciiu: CodigoCiiu[] = [];
  public barrios: Barrio[] = [];
  public letras: Parametro[] = [];
  public indicaciones: Parametro[] = [];
  public comuna: Comuna | null = null;
  public siteKey:string = environments.siteKey ;
  public establecimiento: Establecimiento[] = []
  public errorMessages: string[] = [];
  public clientIp: string | undefined;
  public isLoading: boolean = false;
  public secretKey:string = environments.SECRET_KEY
  public direccionManual: boolean = false;
  @ViewChild('direccionInput') direccionInput!: ElementRef;





  constructor(
    private router: Router,
    private fb: FormBuilder,
    private vs: ValidatorsService,
    private maeic: MaeicService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //valido si tiene datos
    if (!sessionStorage.getItem('establecimiento')) {
      this.router.navigate(['/establecimientos/validar']);
    }
    //cargar datos
    this.loadDataFromSessionStorage();
    // mensaje de alerta
    this.messageAlert();
    //get options
    //cargar data de bd
    this.loadOptions();
    //funcion direccion
    this.OnDireccionChanged();
    //funcion barri
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

    //cargar datos en el form
    this.myForm.patchValue({
      nit: this.nit,
      tipo: this.tipo,
      razon_social: (this.dataCec && this.dataCec[0] && this.dataCec[0].MaeProNom && this.dataCec[0].MaeProNom.trim())
      ? this.quitarComillas(this.dataCec[0].MaeProNom.trim())
      : '',
      registro_iyc: this.dataCec[0]?.MaeNum?.trim() || '',
      matricula_mercantil: this.dataCec[0]?.RadMatMer?.trim() || '',
      direccion_maeic: this.dataCec[0]?.MaeDir?.trim() || '',
      numero_predial: this.dataCec[0]?.MaePreNum.trim() || '',

    });
    console.log(this.ciiu)

  }
  //getters
  get datos() {
    return this.dataCec;
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
  //paramentros iniciales
  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink: false },
    { label: 'Concepto Sanitario', url: '/', ngLink: true },
    { label: 'Validar', url: '/establecimientos/validar', ngLink: true },
    { label: 'Registrate', url: '', ngLink: true },
  ];
  public titulo: string = 'TRAMITE DE CONCEPTO SANITARIO';
  public subitulo: string = 'Registrate';

  private loadDataFromSessionStorage(): void {
    const data = sessionStorage.getItem('establecimiento');
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
    this.nit =
      JSON.parse(sessionStorage.getItem('nit')!) ||
      this.vs.removeLeadingZeros(this.dataCec[0].MaeProCod);
    this.tipo =JSON.parse(sessionStorage.getItem('tipo')!);


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
          return this.router.navigate(['/establecimientos/validar']);
        } else {
          this.actividades = data.actividades;
          this.departamentos = data.departamentos;
          this.corregimientos = data.corregimiento;
          this.ciiu = data.ciiu;
          this.barrios = data.barrios;
          this.letras = data.letras;
          this.indicaciones = data.indicaciones;
          this.ciiu = this.ciiu.map(item => ({
            ...item,
            displayLabel: `${item.Codigo}|${item.CodDes}`
          }));
          return;
        }
      });
  }
  OnDireccionChanged(): void {
    this.myForm.valueChanges.pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))

    ).subscribe(() => {
      if (!this.direccionManual) {
          this.concatenarDireccion();
          }

    });
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

  public myForm: FormGroup = this.fb.group({
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
      [Validators.maxLength(100), Validators.pattern(this.vs.razonSocialPattern)],
    ],
    registro_iyc: [
      '',
      [Validators.maxLength(7), Validators.pattern(this.vs.numberPattern)],
    ],
    matricula_mercantil: [
      '',
      [Validators.maxLength(15), Validators.pattern(this.vs.numberScriptPattern)],
    ],
    direccion_maeic: ['', []],
    numero_predial: ['', []],
    actividad_economica: [null, [Validators.required]],
    telefono: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7),Validators.pattern(this.vs.numberPattern)]],
    correo_electronico: ['', [Validators.required, Validators.pattern(this.vs.emailPattern)]],
    confirme_email: ['', [Validators.required, Validators.pattern(this.vs.emailPattern)]],
    calle: ['', [Validators.required]],
    numero_nombre: [
      '',
      [
        Validators.required,
        Validators.pattern(this.vs.numberStringPattern),
        Validators.maxLength(10),
      ],
    ],
    numero_uno: [
      '',
      [
        Validators.required,
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
    direccion: ['', [Validators.required]],
    complemento_direccion: ['', [Validators.pattern(this.vs.numberStringPattern), Validators.maxLength(100)]],
    barrio: ['', [Validators.required]],
    comuna: ['', [Validators.required]],
    corregimiento: ['', []],
    municipio: ['Bucaramanga', [Validators.required]],
    departamento: ['Santander', [Validators.required]],
    nom_propietario: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(this.vs.letterPAttern)]],
    ape_propietario: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(this.vs.letterPAttern)]],
    tipo_documento_pro: ['', [Validators.required]],
    documento_propietario: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(this.vs.numberPattern)]],
    nom_representante: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(this.vs.letterPAttern)]],
    ape_representante: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(this.vs.letterPAttern)]],
    tipo_documento_repre: ['', [Validators.required]],
    documento_repre: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(this.vs.numberPattern)]],
    correo_representante: ['', [Validators.pattern(this.vs.emailPattern)]],
    direccion_notificacion: ['', [Validators.pattern(this.vs.addressPattern), Validators.maxLength(100)]],
    departamento_notificacion: ['', []],
    municipio_notificacion: ['', []],
    autoriza_notificaciones: ['1', [Validators.required]],
    id_ciuu : ['', [Validators.required,]],
    numero_trabajadores : ['', [Validators.maxLength(5), Validators.pattern(this.vs.numberPattern)]],
    horario : ['', [Validators.maxLength(150), Validators.pattern(this.vs.mulitplePattern)]],
    observaciones : ['', [Validators.maxLength(150), Validators.pattern(this.vs.mulitplePattern)]],
    tratamiento_datos : ['', [Validators.required]],
    acepto_terminos : ['', [Validators.required]],
    confirmo_mayor_edad : ['', [Validators.required]],
    recaptcha: ['', Validators.required],
    direccion_manual : [false, []],


  }, {
    validators: [
      this.vs.isFieldOneEqualFieldTwo('correo_electronico','confirme_email')
    ]
  });

  private messageAlert() {
    if (this.datos.length > 0) {
      Swal.fire(
        'Datos Validados Exitosamente!',
        'Continuemos con el registro',
        'success'
      );

      return;
    } else {
      Swal.fire({
        title: '¿Estas seguro de continuar con el registro?',
        text: `No se encontraron resultados para el NIT ${this.nit}`,
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
          return;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.router.navigate(['/establecimientos/validar']);
        }
      });
    }
  }

  searchDeparmentByName(nombre: string): string | null {
    const departamento = this.departamentos.find(depto => depto.departamento === nombre);
  if (departamento) {
    const codigo = departamento.codigo_depto.toString().padStart(2, '0');
    return codigo;
  }
  return null
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.establecimiento = this.myForm.value;



    //realizar peticion
    this.isLoading = true
    this.maeic.addEstablecimiento(this.establecimiento).
     pipe(
      delay(2500),
      catchError((error: HttpErrorResponse) => {
               return of({ success: false, errors: [] } as DataValidate);
      })).
    subscribe(response=>{
        if(response.success){

          Swal.fire({
            title: '¡Registro Exitoso!',
            text: 'Establecimiento Registrado Exitosamente!',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            this.isLoading = false
            sessionStorage.clear();
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(response.data), this.secretKey).toString();
            sessionStorage.setItem('encryptedData', encryptedData);

            this.router.navigate(['/establecimientos/finaliza']);
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
  }

  toggleDireccionManual() {
  this.direccionManual = !this.direccionManual;

  const direccionControl = this.myForm.get('direccion');
  const calle = this.myForm.get('calle');
  const numero_nombre = this.myForm.get('numero_nombre');
  const numero_uno = this.myForm.get('numero_uno');
  // ...otros controles que necesites

  if (this.direccionManual) {
    // Permitir edición manual y quitar el required de todos los campos relacionados
    if (calle) {
      calle.clearValidators();
      calle.setValidators([]);
      calle.updateValueAndValidity();
      calle.enable();
      calle.setValue('');
    }
    if (numero_nombre) {
      numero_nombre.clearValidators();
      numero_nombre.setValidators([]);
      numero_nombre.updateValueAndValidity();
      numero_nombre.enable();
      numero_nombre.setValue('');
    }
    if (numero_uno) {
      numero_uno.clearValidators();
      numero_uno.setValidators([]);
      numero_uno.updateValueAndValidity();
      numero_uno.enable();
      numero_uno.setValue('');
    }
    if(direccionControl){
      direccionControl.enable();
      direccionControl.setValue('');
    }

    setTimeout(() => {
      this.direccionInput?.nativeElement.focus();
    }, 0);

  } else {
    // Volver a modo parametrizado y poner required en todos los campos
    if (calle) {
      calle.setValidators([Validators.required]);
       calle.updateValueAndValidity();
    }
    if (numero_nombre) {
      numero_nombre.setValidators([Validators.required]);
      numero_nombre.updateValueAndValidity();
    }
    if (numero_uno) {
      numero_uno.setValidators([Validators.required]);
      numero_uno.updateValueAndValidity();
    }
    if (direccionControl) {
      direccionControl.setValidators([Validators.required]);
      direccionControl.updateValueAndValidity();

    }
     this.concatenarDireccion();
  }
}






    // const response = (window as any).grecaptcha.getResponse();









  //validaciones

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
   quitarComillas(cadena: any) {
    // Expresión regular que coincide con comillas simples, dobles y backticks
    return cadena.replace(/['"`´´]/g, '');
}
}
