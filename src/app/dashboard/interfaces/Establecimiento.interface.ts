export interface Establecimiento {
  id?: string|number;
  inscripcion?: string|number;
  actividad_id: string;
  nit: string;
  registro_iyc?: string;
  matricula_mercantil?: string;
  razon_social: string;
  nombre_comercial: string;
  direccion_maeic?: string;
  direccion: string;
  complemento_direccion?: string;
  departamento: string;
  municipio: string;
  barrio: string;
  comuna: string;
  corregimiento?: string;
  telefono: string;
  correo_electronico: string;
  nom_propietario: string;
  ape_propietario: string;
  tipo_documento_pro: string;
  documento_propietario: string;
  nom_representante: string;
  ape_representante: string;
  tipo_documento_repre: string;
  documento_repre: string;
  correo_representante?: string;
  direccion_notificacion?: string;
  direccion_notificacion_electronica?: string;
  autoriza_notificaciones?: string;
  departamento_notificacion?: string;
  municipio_notificacion?: string;
  codigo_ciuu?: string;
  horario?: string;
  numero_trabajadores?: number;
  status?: string;
  tratamiento_datos: string|boolean;
  acepto_terminos: string|boolean;
  confirmo_mayor_edad: string|boolean;
  recaptcha?: string;
  created_at?: string;
  confirme_email: string;
  calle?: string;
  numero_uno?: string;
  numero_dos?: string;
  letra_uno?: string;
  letra_dos?: string;
  letra_tres?: string;
  tipo: string;
  previousValues? : {},
  currentValues?:{}
}


