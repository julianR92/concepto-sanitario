import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DataValidate } from '../../dashboard/interfaces/Maeic.interface';
import { catchError, map, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private baseUrl: string = environments.baseUrl
  private apiUrl: string = environments.apiUrl

  constructor(private http: HttpClient) { }

  experienciaUser(valor:string, tramite:string){
    return this.http.get<DataValidate>(`${ this.baseUrl }/experiencia/${valor}/${tramite}`)
      .pipe(
        map(response => response),
        catchError(() => of(null))
       );
  }
}
