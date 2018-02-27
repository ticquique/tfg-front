import {
  Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ChatService, SearchService, CommonService } from 'app/private/services';
// tslint:disable-next-line:max-line-length
import { IConversation, IUser, IMessage, ListConversations, RecordedChat } from 'app/private/interfaces';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

@Component({

  selector: 'chat-page',
  styleUrls: ['./chatPage.component.scss'],
  templateUrl: './chatPage.component.html'
})
export class ChatPageComponent implements OnInit, AfterViewChecked, OnDestroy {

  public chatList: IConversation[];
  public currentChat: IConversation;
  @ViewChild('list') public list: ElementRef;

  public user: IUser;

  // TODO UNREADED
  public unreaded: number;
  public search: string;
  public listUsersSearch: [IUser] | IUser[];
  public searchDelay: number = 1000;
  public currentDelay: number = 1000;

  public recordedChats = {};
  public currentMessage: IMessage = {};
  private sentSubscribe: Subscription;
  private receivedSubscribe: Subscription;

  constructor(
    private commonData: CommonService,
    private chatService: ChatService,
    private searchService: SearchService
  ) { }

  public ngAfterViewChecked() {
    this.scrollToBottom();
  }

  public ngOnInit() {

    this.changedChatlist();
    this.changedRecorded();
    this.waitForExec(100, null, (err) => {
      if (!err) {
        this.getConversation(this.chatList[0].conversationID);
      }

      this.receivedMessage();
      this.sentMessage();
    });
    this.commonData.currentUser.subscribe((data) => {
      this.user = data;
    });
  }

  public ngOnDestroy() {
    this.sentSubscribe.unsubscribe();
    this.receivedSubscribe.unsubscribe();
  }

  public sendMessage() {
    this.currentMessage.createdAt = new Date();
    this.currentMessage.author = {
      username: this.user.username,
      _id: this.user._id
    };
    this.currentMessage.toOpen = [];
    for (const notme of this.currentChat.participants) {
      if (notme._id != this.user._id) { // tslint:disable-line:triple-equals
        this.currentMessage.toOpen.push(notme._id);
      }
    }

    this.chatService.send(this.currentMessage);
  }

  public resetSearcher() {
    this.search = '';
    this.listUsersSearch = null;
  }

  public searcher(event?) {
    if (event && event.key === 'Backspace' && this.search.length === 0) {
      this.listUsersSearch = null;
    }
    if (this.currentDelay === 0 && this.search.length > 0) {
      this.searchService.getUserByPartial(this.search).subscribe((users: [IUser]) => {
        this.listUsersSearch = users;
      });
      this.currentDelay = this.searchDelay;
    } else if (this.currentDelay === this.searchDelay) {
      this.currentDelay--;
      setTimeout(() => {
        this.currentDelay = 0;
        this.searcher();
      }, this.currentDelay);
    }
  }

  // INITIAL SEARCH CHATS
  // private getChatList(next?): void {
  //   this.chatService.listConversations().subscribe((conversations: ListConversations) => {
  //     for (const conversation of conversations.conversations) {
  //       // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:max-line-length
  //       conversation.participants = conversation.participants.filter((element) => (element._id !== this.user._id));
  //     }
  //     this.chatList = conversations.conversations;
  //     this.unreaded = conversations.notOpened;
  //     if (next) { next(conversations.conversations, conversations.notOpened); }
  //   });
  // }

  // IF NOT IN CHATLIST SEARCH THE CHAT IN THE DB
  private getUniqueChatList(who: string, next?): void {
    this.chatService.listUniqueConversation(who).subscribe((conversation: ListConversations) => {
      if (conversation.conversations.length > 0) {
        this.chatService.filterUserArray(conversation.conversations[0].participants, '_id');
        this.chatService.addToChatList(conversation.conversations[0]);
        if (next) {
          next(null, conversation.conversations[0]);
        }
      } else {
        if (next) {
          next('hay que crear una conversacion en server');
        }
      }
    });
  }

  // CREATE NEW CHAT IF NOT EXISTS IN OTHER LIST
  // tslint:disable-next-line:member-ordering
  public newChat(who: string, whoName: string, next?): void {
    let result: boolean;
    if (this.currentChat && this.currentChat.participants) {
      for (const participant of this.currentChat.participants) {
        if (participant._id === who) {
          this.resetSearcher();
          result = true;
        }
      }
    }
    if (!result) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.chatList.length; i++) {
        const element = this.chatList[i];
        for (const participant of element.participants) {
          if (participant._id === who) {
            this.chatService.toTopChatList(i);
            this.getConversation(element.conversationID);
            this.resetSearcher();
            result = true;
          }
        }
      }
      if (!result) {
        this.getUniqueChatList(who, (err, chatList: IConversation) => {
          if (err) {
            this.chatService.createConversation(who, whoName).subscribe(
              (data) => {
                data.participants = this.chatService.filterUserArray(data.participants, '_id');
                this.chatService.addToChatList(data);
                this.getConversation(data.conversationID);
                this.resetSearcher();
              }
            );
          } else {
            this.resetSearcher();
            console.log('CHAT IN DATABASE CORRECTLY CHARGED');
          }
        });
      }
    }

  }

  // NO API, CHANGE CURRENT CHAT FOR THE SELECTED, AS MESSAGES ARE RELATED WITH CURRENTCHAT
  // ALL IS CHANGED, WE SAVE CURRENT MESSAGES ON RECORDEDCHATS

  // LISTEN CHANGES IN RECORDED CHAT
  private changedRecorded() {
    this.chatService.RecordedChats.subscribe((recorded: RecordedChat) => {
      this.recordedChats = recorded;
    });
  }

  // LISTEN CHANGES IN CHATLIST
  private changedChatlist() {
    this.chatService.ChatList.subscribe((chatlist: IConversation[]) => {
      this.chatList = chatlist;
    });
  }

  // LISTEN OUTGOING MESSAGES
  private sentMessage() {
    if (!this.sentSubscribe) {
      this.sentSubscribe = this.chatService.sended.subscribe((message: IMessage) => {
        this.updateChats(message);
        this.currentMessage.body = '';
      });
    }
  }

  // LISTEN INCOMING MESSAGES
  private receivedMessage() {
    if (!this.receivedSubscribe) {
      this.receivedSubscribe = this.chatService.received.subscribe((message: IMessage) => {
        this.updateChats(message);
      });
    }
  }

  // UPDATE CHATS ON NEW MESSASGES, SENT OR RECEIVED
  private updateChats(message: IMessage) {
    const newMessage: IMessage = _.clone(message);

    if (this.currentChat) {
      if (message.conversationID === this.currentChat.conversationID) {
        this.currentChat.messages.unshift(newMessage);
      }
    } else {
      setTimeout(() => {
        if (this.chatList && this.chatList.length > 0) {
          this.currentChat = this.chatList[0];
        } else {
          this.getConversation(message.conversationID, (data) => {
            this.chatService.addToChatList(data);
          });
        }
      }, 400);

    }
  }

  private getConversation(id: string, next?: (data: IConversation) => any): void {

    this.currentMessage.conversationID = id;
    if (this.recordedChats[id]) {
      this.currentChat = this.recordedChats[id];
    } else {
      this.chatService.listConversation(id).subscribe((data) => {
        if (next) { next(data); }
        this.currentChat = data;
        this.chatService.updateRecorded(data);
      });
    }
  }

  private waitForExec(time: number, recount: number = 0, next?: (err?: string) => any) {
    if (!this.chatList[0] && recount < 1000) {
      if (next) {
        setTimeout(() => {
          recount += 100;
          this.waitForExec(time, recount, next);
        }, time);
      } else {
        setTimeout(() => {
          recount += 100;
          this.waitForExec(time, recount);
        }, time);
      }
    } else {
      if (recount >= 1000) {
        next('unused');
      } else {
        next();
      }
    }
  }

  private scrollToBottom(): void {
    try {
      this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
      // tslint:disable-next-line:no-empty
    } catch (err) {

    }
  }

}
