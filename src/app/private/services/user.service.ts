import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { User } from 'app/interfaces';
import { IUser } from '../interfaces';

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

  public getUserProfile(username: string, next?: (err?: any, data?: IUser) => any) {
    // tslint:disable-next-line:max-line-length
    this.httpClient.get(API_URL + '/api/user/username/' + username, { headers: this.headersHttp }).subscribe(
      (data) => {
        return next(null, data);
      },
      (err) => {
        return next(err);
      }
    );
  }

  public followUser(userId: string, next?: (err?: any, data?: string) => any) {
    // tslint:disable-next-line:max-line-length
    this.httpClient.get(API_URL + '/api/user/follow/' + userId, { headers: this.headersHttp }).subscribe(
      (data: string) => {
        return next(null, data);
      },
      (err) => {
        return next(err);
      }
    );
  }

  public getFollows(userId: string, next?: (err?: any, data?: string[]) => any) {
    // tslint:disable-next-line:max-line-length
    this.httpClient.get(API_URL + '/api/user/follows/' + userId, { headers: this.headersHttp }).subscribe(
      (data: string[]) => {
        return next(null, data);
      },
      (err) => {
        return next(err);
      }
    );
  }

  public getFolloweds(userId: string, next?: (err?: any, data?: string[]) => any) {
    // tslint:disable-next-line:max-line-length
    this.httpClient.get(API_URL + '/api/user/followed/' + userId, { headers: this.headersHttp }).subscribe(
      (data: string[]) => {
        return next(null, data);
      },
      (err) => {
        return next(err);
      }
    );
  }

}
