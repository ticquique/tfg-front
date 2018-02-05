import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  public headersHttp = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  public jwtHelper: JwtHelper = new JwtHelper();
  private authToken: any;
  private user: any;

  constructor(private httpClient: HttpClient) { }

  public registerUser(user, next) {

    // tslint:disable-next-line:max-line-length
    this.httpClient.post(API_URL + '/api/auth/register', user, { headers: this.headersHttp }).subscribe(
      (data) => { next(null, data); },
      (err) => { next(err); }
    );

  }

  public authenticateUser(user, next) {

    // tslint:disable-next-line:max-line-length
    this.httpClient.post(API_URL + '/api/auth', user, { headers: this.headersHttp }).subscribe(
      (data) => { next(null, data); },
      (err) => { next(err); }
    );

  }

  public recoverPass(email, username, next) {
    if (email.length > 0) {
      // tslint:disable-next-line:max-line-length
      this.httpClient.post(API_URL + '/api/auth/recover', {email}, { headers: this.headersHttp }).subscribe(
        (data) => { next(null, data); },
        (err) => { console.log(err); next(err); }
      );
    } else {
      // tslint:disable-next-line:max-line-length
      this.httpClient.post(API_URL + '/api/auth/recover', {username} , { headers: this.headersHttp }).subscribe(
        (data) => { next(null, data); },
        (err) => { console.log(err); next(err); }
      );
    }

  }

  public storeUserData(token, remember, user?) {
    if (remember) {
      localStorage.setItem('id_token', token);
    } else {
      sessionStorage.setItem('id_token', token);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user;
    }
    this.authToken = token;
  }

  public loadToken() {
    const token = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');
    this.authToken = token;
  }

  public loggedIn() {
    this.loadToken();
    if (this.authToken) {
      const token = this.jwtHelper.decodeToken(this.authToken);
      console.log(Math.floor(Date.now() / 1000) + '<br>' + token.exp);
      return Math.floor(Date.now() / 1000) < token.exp;
    } else {
      return false;
    }

  }

  public logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    sessionStorage.clear();
  }
}
