import { Establecimiento } from "./Establecimiento.interface";

export interface Maeic {
  MaeNum:      string;
  MaeDir?: string;
  MaeProNom?:   string;
  MaeProCod:   string;
  MaeDes:   string;
  MaeDirNot?:   string;
  MaePreNum:   string;
  RadMatMer?:   string;
}

export interface DataMaeic{

  data? :Maeic[];
  message?: string;
  success: boolean;

}

export interface DataValidate{

  message?: string;
  success: boolean;
  errors? : string[];
  data?: ResponseSucesss|null

}
export interface ResponseSucesss{

  id: string|number;
  inscripcion?: string;
  nit? : string;
  razon_social? : string;
  direccion? : string;
  complemento_direccion? : string;
  mensaje?: string
  radicado?: string


}
export interface QuestionData{

  message?: string;
  success: boolean;
  errors? : string[];
  data?: Establecimiento[]|null

}

export interface AnswerData
{
  preguntas: Question[];
  success: boolean;
  message?: string;
  empresa?: Empresa;
}

export interface Question
{
  enunciado: string;
  opciones: Opciones[];
  respuesta: string|number;

}

export interface Opciones
{
  id: number|string;
  descripcion: string;
  correcta: boolean;
  campo: string

}
export interface Empresa
{
  id?: string|number;
  nit?: string;
  razon_social?: string;
  direccion?: string;
}

export interface  DataRespuestas
{
  id?: string|number;
  nit?: string;
  respuestas?: Respuesta[];
}
export interface Respuesta {
  campo: string;
  valor: string | number;
}


