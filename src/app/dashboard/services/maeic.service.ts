import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { DataMaeic, DataValidate, Maeic } from '../interfaces/Maeic.interface';
import { Establecimiento } from '../interfaces/Establecimiento.interface';
import { Comuna, Municipio, Options } from '../interfaces/Options.interface';

@Injectable({
  providedIn: 'root'
})
export class MaeicService {

  private baseUrl: string = environments.baseUrl
  private apiUrl: string = environments.apiUrl

  constructor(private http: HttpClient) { }

  validateMaeic( nit:string ):Observable<DataMaeic> {
    return this.http.get<DataMaeic>(`${ this.baseUrl }/validate/establecimiento/${nit}`)
      .pipe()



  }
  validateEstablecimiento( nit:string, maeic:string ):Observable<DataValidate> {
    return this.http.get<DataValidate>(`${ this.baseUrl }/validate/registro/${nit}/${maeic}`)
      .pipe( );
  }

  getOptions():Observable<Options|null> {
    return this.http.get<Options|null>(`${ this.baseUrl }/get-options/data`)
      .pipe( );
  }
  getComunaByBarrio(barrio: string):Observable<Comuna[]|null> {
    return this.http.get<{comuna: Comuna}|null>(`${ this.baseUrl }/get-options/comuna/${barrio}`)
      .pipe(
        map(response => response ? [response.comuna] : null),
        catchError(() => of(null))
       );
  }
  getMunicipiosbyId(departamento_id: string):Observable<Municipio[]|null> {
    return this.http.get<{municipios: Municipio[]}|null>(`${ this.baseUrl }/get-options/municipio/${departamento_id}`)
      .pipe(
        map(response => response ? response.municipios : null),
        catchError(() => of(null))
       );
  }

  addEstablecimiento( establecimiento: Establecimiento[]):Observable <DataValidate>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<DataValidate>(`${this.baseUrl}/establecimientos`, establecimiento,{headers}).pipe(

    );
  }

  getIp(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>(this.apiUrl);
  }

}
