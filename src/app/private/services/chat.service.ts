import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Chat } from '../models/chat';

import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from 'app/private/services';
import { JwtHelper } from 'angular2-jwt';
import { Subscription } from 'rxjs/Subscription';

interface OldMessagesResponse {
  messages:
  [{
    _id?: string,
    updatedAt?: Date,
    createdAt?: Date,
    conversationId?: string,
    body?: string,
    author?: {
      _id?: string,
      username?: string
    },
    __v?: number,
    toOpen: [string]
  }];
}

interface ListConversationsResponse {
  conversations:
  [{
    conversationId: string,
    participants: [{
      _id: string,
      username: string
    }] | any,
    notOpened: number
    message?: OldMessagesResponse,
    numMessages: number
  }];
}

@Injectable()
export class ChatService {
  public joinSub: Subscription;
  public joinStream: Observable<any>;

  public activeChat: Chat;

  public socket: any;
  public userID: string;
  public username: string;

  public socketConnected$ = new BehaviorSubject<boolean>(false);
  public activeChats = [];

  public headersHttp = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {

    this.loadInitialData();
  }

  public loadInitialData() {
    const jwtHelper: JwtHelper = new JwtHelper();
    const token = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');
    if (token) {
      const decodedToken = jwtHelper.decodeToken(token);
      this.userID = decodedToken.id;
      this.username = decodedToken.username;
    }

    this.socket = io(SOCKET.baseUrl + '?id=' + this.userID, SOCKET.opts);
    this.socket.on('connect', () => this.socketConnected$.next(true));
    this.socket.on('disconnect', () => this.socketConnected$.next(false));

    this.socketConnected$.asObservable().subscribe((connected) => {
      console.log('Socket connected: ', connected);
    });

    this.joinStream = this.listen('add');
    this.joinSub = this.joinStream.subscribe((res) => {
      this.join(res);
    });
  }

  public listConversations(next) {
    this.http.get(API_URL + '/api/chat/', { headers: this.headersHttp })
      .subscribe(
      (data: ListConversationsResponse) => {

        const arrayConversations = [];
        data.conversations.map((conversation) => {
          // tslint:disable-next-line:max-line-length
          conversation.participants = conversation.participants.filter((user) => user._id !== this.userID)[0];
          arrayConversations.unshift(conversation);
        });

        return next(null, arrayConversations);
        // chat.send(message, this.username);
      },
      (err) => {
        return next(err);
      }
      );
  }

  public getOldMessages(conversationID, next) {
    this.http.get(API_URL + '/api/chat/' + conversationID, { headers: this.headersHttp })
      .subscribe(
      (data: OldMessagesResponse) => {
        let chat = this.getChat(conversationID);

        if (!chat) {
          chat = new Chat(conversationID);
          this.activeChats.unshift(chat);
        }

        this.activeChat = chat;
        data.messages.map((element) => {
          this.activeChat.msgList.unshift({ usr: element.author.username, msg: element.body });
        });

        return next(null, data.messages);
        // chat.send(message, this.username);
      },
      (err) => {
        return next(err);
      }
      );
  }

  public join(frq: string): Chat {

    let chat = this.getChat(frq);

    if (!chat) {
      chat = new Chat(frq);
      this.activeChats.unshift(chat);
    }

    this.activeChat = chat;

    return chat;
  }

  public leave(frq: string) {
    this.getChat(frq).leave();
    this.activeChats = this.activeChats.filter((c) => c.frq !== frq);
  }

  public getChat(frq): Chat {
    return this.activeChats.filter((c) => c.frq === frq)[0];
  }

  public newChat(recipient: string, compossition?: string) {
    let body = {};

    if (compossition && compossition.length) {
      body = { compossition };
    }

    // tslint:disable-next-line:max-line-length
    this.http.post(API_URL + '/api/chat/new/' + recipient, body, { headers: this.headersHttp })
      .subscribe(
      (data: {
        conversationId: string, message: string
      }) => {
        let chat = this.getChat(data.conversationId);

        if (!chat) {
          chat = new Chat(data.conversationId, recipient);
          this.activeChats.unshift(chat);
        } else {
          chat.add(recipient);
        }

        this.activeChat = chat;

        if (compossition) {
          chat.send(compossition, {recipient});
        }

        return chat;

      }
      );

  }

  public listen(event: string): Observable<any> {

    return new Observable((observer) => {

      this.socket.on(event, (data) => {
        console.log('incoming for', event, data);
        observer.next(data);
      });

      // observable is disposed
      return () => {
        this.socket.off(event);
      };

    });

  }

}
