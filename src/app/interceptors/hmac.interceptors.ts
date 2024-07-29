import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import sha256 from 'crypto-js/hmac-sha256';
import { environments } from '../../environments/environments';



@Injectable()
export class HmacInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const secret = environments.SECRET_HMAC; // Este debe coincidir con el backend
        const payload = request.body ? JSON.stringify(request.body) : '';
        const signature = sha256(payload, secret).toString();
        const authReq = request.clone({
            setHeaders: {
                'X-HMAC-SIGNATURE': signature
            }
        });

        return next.handle(authReq);
    }
}


