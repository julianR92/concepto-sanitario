export interface Establecimiento {
  id: number;
  radicado: string | number;
  fecha_solicitud: Date;
  nombre_solicitante: string;
  documento_identificacion: string;
  direccion_solicitante: string;
  correo_electronico: string;
  telefono: string;
  numero_licencia: string;
  modalidad_licencia: string;
  direccion_predio: string;
  barrio: string;
  numero_folio_matricula_inmobiliaria: string;
  propietario_predio: string;
  nombre_constructor?: string;
  fecha_aproximada_documentacion?: Date;
  documentos_requeridos?: string;
  motivo_destinacion: string;
  observaciones?: string;
  estado_solicitud: EstadoSolicitud;
  documento_certificado_libertad: string;
  documento_no_encontrado?: string;
  acepta_terminos: AceptaTyN;
  autoriza_notificacion: AceptaTyN;
  fecha_aprobacion?: Date;
  created_at: Date;
  updated_at: Date;
}

enum EstadoSolicitud {
  'RADICADO'='RADICADO',
  'EN TRAMITE'='EN TRAMITE',
  'NO ENCONTRADO'='NO ENCONTRADO',
  'RECHAZADO'='RECHAZADO',
  'POR ENTREGAR'='POR ENTREGAR',
  'CERTIFICADO'='CERTIFICADO',
  'FINALIZAD'='FINALIZADO'
}

enum AceptaTyN {
  'SI' = 'SI',
  'NO' = 'NO',
}
