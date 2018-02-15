import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { User } from 'app/interfaces';

@Injectable()
export class UserService {

  private users: User;

  private headersHttp = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {

  }

  public listUsers(next) {

    // tslint:disable-next-line:max-line-length
    this.httpClient.get(API_URL + '/api/user', { headers: this.headersHttp }).subscribe(
      (data) => {
        this.users = data;
        return next(null, data);
      },
      (err) => {
        return next(err);
      }
    );

  }

}
