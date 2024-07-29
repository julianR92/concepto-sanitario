
export interface ActividadEconomica {
  id: number|string;
  descripcion: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Barrio {
  codigo: string;
  nombre: string;
  codigo_comuna: string;
  created_at: string;
  updated_at: string;
}

export interface Corregimiento {
  codigo: string;
  nombre: string;
}

export interface Departamento {
  codigo_depto: string;
  departamento: string;
}

export interface Municipio {
  codigo_muni: string;
  municipio: string;
  codigo_depto: string;
}

export interface Parametro {
  IdParametro: number|string;
  ParNomGru: string;
  ParNom: string;
  ParDes: string;
}

export interface CodigoCiiu {
  IdCiiu: number;
  Codigo: string;
  CodDes: string;
  SectorId: string;
}
export interface Comuna {
  codigo: string;
  nombre: string;

}
export interface Options{
  departamentos: Departamento[];
  corregimiento: Corregimiento[];
  actividades: ActividadEconomica[];
  ciiu: CodigoCiiu[];
  barrios: Barrio[];
  letras: Parametro[];
  indicaciones: Parametro[];

}
