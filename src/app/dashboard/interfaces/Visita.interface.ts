import { Establecimiento } from './Establecimiento.interface';
export interface Visita {
  id: string|number,
  radicado?: string|number,
  fecha_solicitud?: string|null,
  concepto?: string|null,
  tipo_establecimiento?: string|null,
  numero_acta?: string|null,
  subprograma_id?: string|number|null,
  territorio?: string|null,
  estado?: string,
  tecnico_id ?: string|number|null,
  status?: string|number,
  ruta_acta?: string|null,
  ruta_representacion?: string|null,
  ruta_uso?: string|null,
  ruta_concepto?: string|null,
  fecha_limite?: string|null,
  fecha_prorroga?: string|null,
  created_at?: null|string,
  updated_at?: null|string,
  observaciones?: ObservacionesVisita[]|null
  establecimiento?: Establecimiento|null
  tecnico?: Tecnico|null
}

export interface ObservacionesVisita {
  id: string|number,
  visita_id ?: string|number,
  observaciones?: string|null,
  estado_parcial?: string|null,
  accion_realizada?: string|null,
  user_id?: string|null,
  direccion_ip?: string|null,
  created_at?: null|string,
  updated_at?: null|string,


}
export interface Tecnico {
  id: string|number,
  nombres ?: string|number,
  apellidos?: string|null,
  documento?: string|null,
  email?: string|null,
  subprograma_id?: string|null,
  user_id?: string|null
  status?: string|null
  created_at?: null|string,
  updated_at?: null|string,


}
export interface DataVisita {
  message?: string;
  success: boolean;
  errors? : string[];
  data?: Visita|null
}
