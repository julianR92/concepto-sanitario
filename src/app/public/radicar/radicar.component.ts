import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LineaAvanceService } from '../../shared/services/linea-avance.service';

@Component({
	selector: 'app-radicar',
	templateUrl: './radicar.component.html',
	styleUrl: './radicar.component.css',
})
export class RadicarComponent implements OnInit {
	public titulo: string = 'TRAMITE DE PRESTAMO DE PLANOS';
	public subitulo: string = 'Radicar nuevo';

	public breadcrumbItems = [
		{ label: 'Inicio', url: 'https://www.bucaramanga.gov.co/' },
		{ label: 'Prestamo de planos' },
		{ label: 'Radicar' },
	];

	constructor(
		private lineaAvanceService: LineaAvanceService,
		private router: Router,
		private fb: FormBuilder,
	) {}

	public myForm: FormGroup = this.fb.group(
		{
			radicado: ['', [Validators.required]],
			fecha_solicitud: ['', [Validators.required]],
			nombre_solicitante: ['', [Validators.required, Validators.maxLength(100)]],
			documento_identificacion: ['', [Validators.required, Validators.maxLength(20)]],
			direccion_solicitante: ['', [Validators.required, Validators.maxLength(255)]],

			password: ['', [Validators.required, Validators.minLength(6)]],
			password2: ['', [Validators.required]],
		},

	);

	ngOnInit(): void {
		this.lineaAvanceService.avanzar();
		//cargar datos en el form
		this.myForm.patchValue({

		});
	}
}
//crear un modelo y pasarlo a zod
