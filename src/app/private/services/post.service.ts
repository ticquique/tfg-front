import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {
  HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '.';

import { IPost, IAttachment, IUser } from '../interfaces';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostService {

  public postList: IPost[] = [];

  private headersHttp = new HttpHeaders({ 'Content-Type': 'application/json' });
  private user: IUser;

  constructor(
    private http: HttpClient,
    private commonData: CommonService
  ) {
    this.initializer();
  }

  public listPosts(): Observable<IPost[]> {
    return this.http.get(API_URL + '/api/chat/', { headers: this.headersHttp })
      .map((res: Response) => {
        return res;
      })
      .catch(this.handleError);
  }

  public getPosts(): Observable<IPost[]> {
    return this.http.get(API_URL + '/api/post', { headers: this.headersHttp })
      .map((data) => {
        return data;
      })
      .catch(this.handleError);
  }

  // PRIVATE

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Node.js server error');
  }

  private initializer(next?) {
    this.commonData.currentUser.subscribe((user) => {
      this.user = user;
      if (next) {
        this.initialData(next);
      } else {
        this.initialData();
      }
    });
  }

  private initialData(next?: (postList: IPost[]) => any) {
    //  INITIALIZE LIST OF POSTS
    this.getPosts().subscribe((listPost: IPost[]) => {
      this.postList = listPost;
      console.log(this.postList);
      if (next) {
        next(this.postList);
      }
    });
  }

}
