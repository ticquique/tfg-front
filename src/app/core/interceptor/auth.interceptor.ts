import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /*
    * @whatItDoes Adds the authentication token to every http request
  */

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    // tslint:disable-next-line:max-line-length
    const currentUser = localStorage.getItem('id_token');

    if (currentUser) {
      try {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ` + currentUser
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
    return next.handle(request);
  }
}
