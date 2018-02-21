import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IUser } from '../interfaces';

@Injectable()
export class CommonService {

  private user: BehaviorSubject<IUser>;

  constructor() {
    this.loadAll();
  }

  public loadAll() {
    const jwtHelper: JwtHelper = new JwtHelper();
    const token = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');
    if (token) {
      const decodedToken = jwtHelper.decodeToken(token);
      const newUser: IUser = {username: decodedToken.username, _id: decodedToken.id};
      this.user = new BehaviorSubject(newUser);
    }
  }

  get currentUser() {
    return this.user.asObservable();
  }

  public changeUser(user: IUser) {
    this.user.next(user);
  }

}
