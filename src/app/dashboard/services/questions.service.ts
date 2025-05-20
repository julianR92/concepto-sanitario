import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AnswerData, DataMaeic, DataRespuestas, DataValidate, QuestionData } from '../interfaces/Maeic.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private baseUrl: string = environments.baseUrl
  private apiUrl: string = environments.apiUrl


  constructor(private http: HttpClient) {

   }
   validateEstablecimiento( nit:string ):Observable<QuestionData> {
       return this.http.get<QuestionData>(`${ this.baseUrl }/validar/inscripcion/${nit}`)
         .pipe()
     }

     getDataQuestions( id:string ):Observable<AnswerData> {
       return this.http.get<AnswerData>(`${ this.baseUrl }/getData/questions/${id}`)
         .pipe()
     }

     validateRespuestas( preguntas: DataRespuestas):Observable <DataValidate>{
         const headers = new HttpHeaders({
           'Content-Type': 'application/json',
         });
         return this.http.post<DataValidate>(`${this.baseUrl}/respuestas`, preguntas,{headers}).pipe(

         );
       }
}
