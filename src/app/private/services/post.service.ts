import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '.';

import { IPost, IAttachment, IUser } from '../interfaces';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {

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

  // PRIVATE

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
      this.initialData();
      this.user = user;
    });
  }

  private initialData() {
    // INITIALIZE LIST OF POSTS
    // this.listConversations().subscribe((listConversations: ListConversations) => {
    //   for (const conversation of listConversations.conversations) {
    //     // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    //     conversation.participants = conversation.participants.filter((element) => (element._id !== this.user._id));
    //   }
    // });
  }

}
