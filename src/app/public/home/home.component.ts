import { Component, OnInit } from '@angular/core';
import { LineaAvanceService } from '../../shared/services/linea-avance.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
	public titulo: string = 'TRAMITE DE PRESTAMO DE PLANOS';
	public subitulo: string = 'Alcaldía de Bucaramanga';

	public breadcrumbItems = [
		{ label: 'Inicio', url: 'https://www.bucaramanga.gov.co/' },
		{ label: 'Prestamo de planos' },
	];

	constructor(private lineaAvanceService: LineaAvanceService) {}

	ngOnInit(): void {
		this.lineaAvanceService.iniciar();
	}
}
