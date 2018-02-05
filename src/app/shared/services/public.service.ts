import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class PublicService {

  public headersHttp = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) { }

  public getRoles(next) {

    // tslint:disable-next-line:max-line-length
    this.httpClient.get(API_URL + '/api/role', { headers: this.headersHttp }).subscribe(
      (data) => { next(null, data); },
      (err) => { next(err); }
    );

  }
}
