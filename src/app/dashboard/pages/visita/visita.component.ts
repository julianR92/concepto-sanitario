import { Component, OnInit } from '@angular/core';
import {
  DataValidate,
  ResponseSucesss,
} from '../../interfaces/Maeic.interface';
import { Router } from '@angular/router';
import { environments } from '../../../../environments/environments';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { MaeicService } from '../../services/maeic.service';
import { catchError, delay, distinctUntilChanged, map, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';
import { BreadcrumbItem } from '../../../shared/interfaces/miga.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-visita',
  templateUrl: './visita.component.html',
  styleUrl: './visita.component.css',
})
export class VisitaComponent implements OnInit {
  public secretKey: string = environments.SECRET_KEY;
  public siteKey: string = environments.siteKey;
  public establecimiento: any | null = null;
  public isLoading: boolean = false;

  public breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: 'https://www.bucaramanga.gov.co/', ngLink: false },
    { label: 'Concepto Sanitario', url: '/', ngLink: true },
    { label: 'Establecimientos', url: '/establecimientos', ngLink: true },
    { label: 'Solicitar Visita', url: '', ngLink: false },
  ];
  public titulo: string = 'TRAMITE DE CONCEPTO SANITARIO';
  public subitulo: string = 'Solicitar Visita';

  constructor(
    private router: Router,
    private maeic: MaeicService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private vs: ValidatorsService
  ) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('encryptedData')) {
      this.router.navigate(['/establecimientos']);
    }
    const encryptedData = sessionStorage.getItem('encryptedData'); //cargar data de bd

    if (encryptedData) {
      try {
        // Desencripta los datos
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
        const id = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.getDatabyId(id);
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: '¡Error!',
          text: 'Error al descencryptar los datos!',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          sessionStorage.clear();
          this.router.navigate(['/establecimientos/']);
        });
      }
    } else {
      console.log('No hay datos almacenados');
    }
  }

  public myForm: FormGroup = this.fb.group({
    id: ['', Validators.required],
    nit: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    razon_social: ['', [Validators.required]],
    barrio: ['', [Validators.required]],
    complemento_direccion: ['', []],
    file_representacion: [null, [Validators.required]],
    file_uso: [null, [Validators.required]],
    recaptcha: ['', Validators.required],
    inscripcion: ['', Validators.required],
    comuna: ['', Validators.required],
  });

  getDatabyId(id: string) {
    this.maeic
      .getEstablecimientobyId(id)
      .pipe(
        delay(500),
        catchError((error) => {
          return of({ data: [] });
        })
      )
      .subscribe((data) => {
        if (data) {
          this.establecimiento = data;
          this.loadEstablecimiento();
        } else {
          this.toastr.error(
            'Se presento un error al cargar los datos intente mas tarde',
            'Error'
          );
          this.router.navigate(['/establecimientos/']);
        }
      });
  }

  loadEstablecimiento() {
    //cargar datos en el form
    this.myForm.patchValue({
      nit: this.establecimiento?.nit,
      id: this.establecimiento?.id,
      inscripcion: this.establecimiento?.inscripcion,
      complemento_direccion: this.establecimiento?.complemento_direccion,
      barrio: this.establecimiento?.barrio,
      razon_social: this.establecimiento?.razon_social,
      direccion: this.establecimiento?.direccion,
      comuna: this.establecimiento?.comuna,
    });
  }

  // Manejar archivo seleccionado del primer FileUpload
  onFileRepresentacion(file: File | null) {
    if (file) {
      this.myForm.patchValue({ file_representacion: file });
    } else {
      this.myForm.patchValue({ file_representacion: null });
    }
  }

  // Manejar archivo seleccionado del segundo FileUpload
  onFileUso(file: File | null) {
    if (file) {
      this.myForm.patchValue({ file_uso: file });
    } else {
      this.myForm.patchValue({ file_uso: null });
    }
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const formData: FormData = new FormData();

    // Agregar los archivos
    const fileRepresentacion = this.myForm.get('file_representacion')?.value;
    const fileUso = this.myForm.get('file_uso')?.value;

    if (fileRepresentacion) {
      formData.append('file_representacion', fileRepresentacion);
    }

    if (fileUso) {
      formData.append('file_uso', fileUso);
    }

    // Agregar otros datos del formulario
    Object.keys(this.myForm.controls).forEach((key) => {
      if (key !== 'file_representacion' && key !== 'file_uso') {
        // Evitar duplicar los archivos
        formData.append(key, this.myForm.get(key)?.value);
      }
    });

    Swal.fire({
      title: '¿Estas seguro de cargar estos documentos?',
      text: `Asegurate de cargar los documentos correctos`,
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
        this.isLoading = true;
        this.maeic
          .solicitarVisita(formData)
          .pipe(
            delay(2500),
            catchError((error: HttpErrorResponse) => {
              return of({ success: false, errors: [] } as DataValidate);
            })
          )
          .subscribe((response) => {
            if (response.success) {
              Swal.fire({
                title: 'Proceso Exitoso!',
                text: 'Documentos Cargados Exitosamente!',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
              }).then(() => {
                this.isLoading = false;
                sessionStorage.clear();
                const encryptedData = CryptoJS.AES.encrypt(
                  JSON.stringify(response.data),
                  this.secretKey
                ).toString();
                sessionStorage.setItem('encryptedData', encryptedData);

                this.router.navigate([
                  '/establecimientos/visita-finalizada',
                ]);
              });
            } else {
              const errors = response.errors ?? [];
              if (errors.length > 0) {
                this.isLoading = false;
                this.showErrorMessages(errors);
                return;
              }
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.isLoading = false;
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
  showErrorMessages(errors: string[]): void {
    errors.forEach((error) => {
      this.toastr.error(error, 'Error');
    });
  }
}
