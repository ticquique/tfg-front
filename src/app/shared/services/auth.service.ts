import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  public headersHttp = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private authToken: any;
  private user: any;

  constructor(private httpClient: HttpClient) {}

  public registerUser(user) {

    // tslint:disable-next-line:max-line-length
    this.httpClient.post(API_URL + '/api/auth/register', user, { headers: this.headersHttp }).subscribe((data) => {
      console.log(data);
    });

  }

  public authenticateUser(user) {

    // tslint:disable-next-line:max-line-length
    this.httpClient.post(API_URL + '/api/auth', user, { headers: this.headersHttp }).subscribe((data) => {
      console.log(data);
    });

  }

  public storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  public loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  public loggedIn() {
    return tokenNotExpired('id_token');
  }

  public logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
