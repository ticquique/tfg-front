import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as io from 'socket.io-client';
import { JwtHelper } from 'angular2-jwt';
import { HttpHeaders } from '@angular/common/http';

export class Chat {

  public msgList: any[] = [];
  private socket: any;
  private socketConnected$ = new BehaviorSubject<boolean>(false);

  private frq: string;
  private chatStream: Observable<any>;
  private chatSub: Subscription;

  private userID: any;
  private username: any;

  private headersHttp = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(frq: string, extuser?: string) {
    if (extuser) {
      this.loadInitialData(frq, extuser);
    } else {
      this.loadInitialData(frq);
    }
  }

  public loadInitialData(frq: string, extuser?: string) {
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

    this.frq = frq;
    if (extuser) {
      this.socket.emit('create', { frq, extuser });
    } else {
      this.socket.emit('join', { frq });
    }

    this.chatStream = this.listen('chat');

    this.chatSub = this.chatStream.subscribe((res) => this.msgList.push(res));
  }

  public add(extuser) {
    this.socket.emit('create', { frq: this.frq, extuser });
  }

  public send(msg: string, data?: {recipient: string}) {
    if (msg.length) {
      this.socket.emit('send', { msg, usr: this.username, frq: this.frq, data });
      this.msgList.push({ msg, usr: this.username, frq: this.frq });
    }
  }

  public listen(event: string): Observable<any> {

    return new Observable((observer) => {

      this.socket.on(event, (data) => {
        console.log('incoming for', event, data);
        if (data.frq === this.frq) {
          observer.next(data);
        }
      });

      // observable is disposed
      return () => {
        this.socket.off(event);
      };

    });

  }

  public leave() {
    this.socket.emit('leave', { frq: this.frq });
  }

}
