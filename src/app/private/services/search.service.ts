import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CommonService } from '.';
import { IUser } from '../interfaces';

@Injectable()
export class SearchService {

  private user: IUser;
  private headersHttp = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private commonData: CommonService
  ) {
    this.initializer();
  }

  public getUserByPartial(username): Observable<[IUser]> {
    const body = { username };
    return this.http.post(API_URL + '/api/user/partial', body, { headers: this.headersHttp })
      .map((res: Response) => {
        return res;
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    // console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Node.js server error');
  }

  private initializer() {
    this.commonData.currentUser.subscribe((user) => {
      this.user = user;
    });
  }

}
