import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpErrorResponse } from '@angular/common/http/src/response';

@Injectable()
export class PrivateService {

  public headersHttp = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

  public authenticateUser() {

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(API_URL + '/api/auth', { headers: this.headersHttp });

  }

}
