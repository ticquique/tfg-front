import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {
  HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams
} from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { CommonService } from '.';

import { IConversation, IUser, IMessage, ListConversations, RecordedChat } from '../interfaces';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

@Injectable()
export class ChatService {

  private headersHttp = new HttpHeaders({ 'Content-Type': 'application/json' });
  private socket;
  private user: IUser;

  private unread: Subject<number> = new Subject();
  private chatList: BehaviorSubject<IConversation[]> = new BehaviorSubject([]);
  private recordedChats: BehaviorSubject<RecordedChat> = new BehaviorSubject({});
  private senderMessage: Subject<IMessage> = new Subject();
  private receivedMessage: Subject<IMessage> = new Subject();

  public RecordedChats = this.recordedChats.asObservable(); // tslint:disable-line
  public sended = this.senderMessage.asObservable(); // tslint:disable-line
  public received = this.receivedMessage.asObservable(); // tslint:disable-line

  constructor(
    private http: HttpClient,
    private commonData: CommonService
  ) {
    this.initializer();
  }

  get ChatList() {
    return this.chatList.asObservable();
  }

  public modifyChatList(conversation: IConversation[]) {
    console.log('modifyChatList');
    this.chatList.next(conversation);
  }

  public modifyRecordedChat(chat: RecordedChat) {
    console.log('modifyRecordedChat');
    this.recordedChats.next(chat);
  }

  public send(message: IMessage) {
    console.log('send');
    this.senderMessage.next(message);
  }

  public listConversations(): Observable<ListConversations> {
    console.log('listConversations');
    return this.http.get(API_URL + '/api/chat/', { headers: this.headersHttp })
      .map((res: Response) => {
        return res;
      })
      .catch(this.handleError);
  }

  public listConversation(id: string): Observable<IConversation> {
    console.log('listConversation');
    return this.http.get<IConversation>(API_URL + '/api/chat/' + id, { headers: this.headersHttp })
      .map((data) => {
        return data;
      })
      .catch(this.handleError);
  }

  public listUniqueConversation(who: string): Observable<ListConversations> {
    console.log('listUniqueConversation');
    return this.http.get(API_URL + '/api/chat/' + '?=1&u=' + who, { headers: this.headersHttp })
      .map((data: ListConversations) => {
        return data;
      })
      .catch(this.handleError);
  }

  public createConversation(userId: string, userUsername: string): Observable<IConversation> {
    console.log('createConversation');
    // tslint:disable-next-line:max-line-length
    const params = new HttpParams().set('whoname', userUsername);
    return this.http.get(API_URL + '/api/chat/new/' + userId, { headers: this.headersHttp, params })
      .map((data) => {
        return data;
      })
      .catch(this.handleError);
  }

  public toTopChatList(index: number) {
    console.log('toTopChatList');
    const chatListAux = _.cloneDeep(this.chatList.getValue());
    chatListAux.unshift(this.chatList.getValue()[index]);
    chatListAux.splice(index + 1, 1);
    this.modifyChatList(chatListAux);
  }

  public addToChatList(conversation: IConversation) {

    console.log('addToChatList');
    const chatListAux = _.cloneDeep(this.chatList.getValue());
    chatListAux.unshift(conversation);
    this.updateRecorded(conversation);
    this.modifyChatList(chatListAux);
  }

  public updateRecorded(conversation: IConversation) {
    console.log('updateRecorded');

    const recordedChats = _.cloneDeep(this.recordedChats.getValue());
    recordedChats[conversation.conversationID] = conversation;
    this.modifyRecordedChat(recordedChats);
  }

  public filterUserArray(array: any[], field?: string): any[] {
    if (field) {
      array = array.filter((el) => {
        return el[field] !== this.user._id;
      });
    } else {
      array = array.filter((el) => {
        return el !== this.user._id;
      });
    }
    return array;
  }
  // EMITERS
  private sendMessage(message: IMessage) {
    console.log('sendMessage');
    const messageAux: IMessage = _.cloneDeep(message);
    this.updateChats(messageAux);
    console.log('enviado');
    this.socket.emit('sentMessage', messageAux);
  }

  private addListeners() {

    console.log('addListeners');
    this.socket.on('receivedMessage', (message) => {
      const messageAux: IMessage = _.clone(message);
      console.log('recibido');
      this.updateChats(messageAux);
      this.receivedMessage.next(messageAux);
    });
  }

  // PRIVATE

  // UPDATE CHATS ON NEW MESSASGES, SENT OR RECEIVED
  private updateChats(message: IMessage) {
    console.log('updatechat');
    const newMessage: IMessage = message;
    const chatList = _.cloneDeep(this.chatList.getValue());
    const recordedChat = _.cloneDeep(this.recordedChats.getValue());

    if (chatList.length === 0) {
      this.listConversation(newMessage.conversationID).subscribe(
        (conversation) => {
          if (conversation.messages.length > 0) {
            this.filterUserArray(conversation.participants, '_id');
            conversation.message = conversation.messages[0];
            this.addToChatList(conversation);
          }
        });
    } else {
      for (let i = 0, n = chatList.length; i < n; i++) {
        if (chatList[i].conversationID === newMessage.conversationID) {
          chatList[i].message = newMessage;
          chatList.unshift(chatList[i]);
          chatList.splice(i + 1, 1);
          recordedChat[message.conversationID].messages.unshift(message);
          this.modifyChatList(chatList);
          this.modifyRecordedChat(recordedChat);
        }
        if (i === n) {
          this.listUniqueConversation(newMessage.author._id).subscribe(
            (conversation) => {
              // console.log(conversation);
              if (conversation.conversations.length > 0) {
                this.filterUserArray(conversation.conversations[0].participants, '_id');
                this.addToChatList(conversation.conversations[0]);
              }
            });
        }
      }
    }

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
    console.log('initializer');
    this.commonData.currentUser.subscribe((user) => {
      this.user = user;
      this.initialData();
      this.socket = io(SOCKET.baseUrl + '?id=' + this.user._id, SOCKET.opts);
      this.addListeners();
      this.sended.subscribe((message) => (this.sendMessage(message)));
    });
  }

  private initialData(next?: (n: IConversation[], unread: number) => any) {
    console.log('initialData');
    // INITIALIZE LIST OF CHATS
    this.listConversations().subscribe((listConversations: ListConversations) => {
      for (const conversation of listConversations.conversations) {
        // tslint:disable-next-line:max-line-length
        conversation.participants = conversation.participants.filter((element) => (element._id !== this.user._id));
      }
      this.modifyChatList(listConversations.conversations);
      this.unread.next(listConversations.notOpened);

      if (next) { next(listConversations.conversations, listConversations.notOpened); }
    });
  }

}
