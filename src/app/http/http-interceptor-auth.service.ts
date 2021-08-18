import { HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilService } from '../util.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorAuthService {

  constructor(
    private basicAuthenticationService : UtilService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler){
    let basicAuthHeaderString = this.basicAuthenticationService.getAuthenticatedToken();
    let username = this.basicAuthenticationService.getAuthenticatedUser()

    if(basicAuthHeaderString && username) { 
      request = request.clone({
        setHeaders : {
            Authorization : basicAuthHeaderString
          }
        }) 
    }
    return next.handle(request);
  }
}
