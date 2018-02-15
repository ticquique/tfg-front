import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { CommonService } from '.';

import { IConversation, IUser, IMessage, ListConversations } from '../interfaces';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChatService2 {

  private headersHttp = new HttpHeaders({ 'Content-Type': 'application/json' });
  private socket;
  private user: IUser;

  private senderMessage: Subject<IMessage> = new ReplaySubject(1);
  private receivedMessage: Subject<IMessage> = new ReplaySubject(1);

  public sended = this.senderMessage.asObservable(); // tslint:disable-line
  public received = this.receivedMessage.asObservable(); // tslint:disable-line

  constructor(
    private http: HttpClient,
    private commonData: CommonService
  ) {
    this.initializer();
  }

  public send(message: IMessage) {
    this.senderMessage.next(message);
  }

  public listConversations(): Observable<ListConversations> {
    return this.http.get(API_URL + '/api/chat/', { headers: this.headersHttp })
      .map((res: Response) => {
        return res;
      })
      .catch(this.handleError);
  }

  public listConversation(id: string): Observable<IConversation> {
    return this.http.get<IConversation>(API_URL + '/api/chat/' + id, { headers: this.headersHttp })
      .map((data) => {
        return data;
      })
      .catch(this.handleError);
  }

  public listUniqueConversation(who: string): Observable<ListConversations> {
    return this.http.get(API_URL + '/api/chat/' + '?=1&u=' + who, { headers: this.headersHttp })
      .map((data) => {
        return data;
      })
      .catch(this.handleError);
  }

//   interface IConversation {
//   conversationId?: string;
//   conversationID?: string;
//   participants?: IUser[];
//   notOpened?: number;
//   message?: IMessage;
//   numMessages?: number;
//   messages?: IMessage[];
// }
  public createConversation(userId: string): Observable <IConversation> {
  return this.http.get(API_URL + '/api/chat/new/' + userId, { headers: this.headersHttp })
    .map((data) => {
      return data;
    })
    .catch(this.handleError);
}
  // EMITERS
  private sendMessage(message: IMessage) {
  this.socket.emit('sentMessage', message);
}

  private addListeners() {
  this.socket.on('receivedMessage', (message) => { this.receivedMessage.next(message); });
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
    this.user = user;
    this.socket = io(SOCKET.baseUrl + '?id=' + this.user.id, SOCKET.opts);
    this.addListeners();
    this.sended.subscribe((message) => (this.sendMessage(message)));
  });
}

}
