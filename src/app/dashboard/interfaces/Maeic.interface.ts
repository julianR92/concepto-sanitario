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

}


