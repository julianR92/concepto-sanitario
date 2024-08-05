import { NotificationService } from './../shared/services/notificacion.service';
// error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
        }
        this.notificationService.showError(errorMessage);


        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
