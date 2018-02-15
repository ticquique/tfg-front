import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ChatService2 } from 'app/private/services';
import { CommonService } from 'app/private/services';
import { IConversation, IUser, IMessage, ListConversations } from 'app/private/interfaces';

@Component({

  selector: 'chat2-page',
  styleUrls: ['./chatPage2.component.scss'],
  templateUrl: './chatPage2.component.html'
})
export class ChatPage2Component implements OnInit, AfterViewChecked {

  @ViewChild('list') private list: ElementRef;

  private user: IUser;
  private unreaded: number;

  private chatList: IConversation[];
  private recordedChats = {};

  private currentChat: IConversation;

  private currentMessage: IMessage = {};

  constructor(
    private commonData: CommonService,
    private chatService: ChatService2
    // tslint:disable-next-line:one-line
  ) { }

  public ngOnInit() {
    this.commonData.currentUser.subscribe((data) => {
      this.user = data;
      this.getChatList((chatlist, numNotOpened) => {
        this.getConversation(chatlist[0].conversationID, (conversation) => {
          this.recordedChats[chatlist[0].conversationID] = conversation;
          this.receivedMessage();
          this.sentMessage();
        });
      });
    });

  }

  public ngAfterViewChecked() {
    this.scrollToBottom();
  }

  public sendMessage() {
    this.currentMessage.createdAt = new Date();
    this.currentMessage.author = {
      username: this.user.username,
      _id: this.user.id
    };
    this.currentMessage.toOpen = [];
    this.currentMessage.toOpen = this.currentChat.participants.filter((el) => el !== this.user.id);
    this.chatService.send(this.currentMessage);
  }

  private getChatList(next?): void {
    this.chatService.listConversations().subscribe((conversations: ListConversations) => {
      for (const conversation of conversations.conversations) {
        // tslint:disable-next-line:max-line-length
        conversation.participants = conversation.participants.filter((element) => (element._id !== this.user.id));
      }
      this.chatList = conversations.conversations;
      this.unreaded = conversations.notOpened;
      if (next) { next(conversations.conversations, conversations.notOpened); }
    });
  }

  // If not in chatlist add to it from individual emmitter
  private getUniqueChatList(who: string, next?): void {
    this.chatService.listUniqueConversation(who).subscribe((conversation: ListConversations) => {
      if (conversation.conversations.length > 0) {
        conversation.conversations[0].participants = conversation.conversations[0].participants
          .filter((element) => (element._id !== this.user.id));

        this.chatList.unshift(conversation.conversations[0]);
      } else {
        console.log('hay que crear una conversacion en server');
      }
    });
  }

  // NO API, CHANGE CURRENT CHAT FOR THE SELECTED, AS MESSAGES ARE RELATED WITH CURRENTCHAT
  // ALL IS CHANGED, WE SAVE CURRENT MESSAGES ON RECORDEDCHATS

  // LISTEN EMMITED NEW MESSAGE
  private sentMessage() {
    this.chatService.sended.subscribe((message: IMessage) => {
      let newMessage: IMessage = {};
      if (message.conversationId === this.currentChat.conversationID) {
        newMessage = {
          author: {
            username: message.author.username,
            _id: message.author._id
          },
          conversationId: message.conversationId,
          body: message.body,
          toOpen: message.toOpen
        };
        this.currentChat.messages.unshift(newMessage);
      } else {
        // Update message in recorded chats if is in it
        if (this.recordedChats[message.conversationId]) {
          this.recordedChats[message.conversationId].messages.unshift(message);
        }
      }
      // loop and replace in chatlist first message if not add element in chatlist
      for (let i = 0, n = this.chatList.length; i < n; i++) {
        if (this.chatList[i].conversationID === newMessage.conversationId) {
          this.chatList[i].message = newMessage;
          break;
        }
        if (i === n) {
          // TODO cambiar por crear nueva IConversation
          this.getUniqueChatList(newMessage.author._id);
        }
      }

      this.currentMessage.body = '';
    });
  }

  // LISTENER NEW MESSAGES
  private receivedMessage() {
    this.chatService.received.subscribe((message: IMessage) => {
      let newMessage: IMessage = {};

      newMessage = {
        author: {
          username: message.author.username,
          _id: message.author._id
        },
        conversationId: message.conversationId,
        body: message.body,
        toOpen: message.toOpen
      };
      if (message.conversationId === this.currentChat.conversationID) {

        this.currentChat.messages.unshift(newMessage);
      } else {
        // Update message in recorded chats if is in it
        if (this.recordedChats[message.conversationId]) {
          this.recordedChats[message.conversationId].messages.unshift(message);
        }
      }
      // loop and replace in chatlist first message if not add element in chatlist
      for (let i = 0, n = this.chatList.length; i < n; i++) {
        if (this.chatList[i].conversationID === newMessage.conversationId) {
          this.chatList[i].message = newMessage;
          break;
        }
        if (i === n) {
          this.getUniqueChatList(newMessage.author._id);
        }
      }
    });
  }

  // IF A MESSAGE IS RECEIVED IN A CONVERSATION NOT CURRENTCHAT NOT IN RECORDEDCHAT[ID]
  // NOT IN CHATLIST WE ADD THIS TO CHATLIST
  // (SEND FUNCTION SENDS DATA{CONVERSATIONID, PARTICIPANTS: USER[], MESSAGE: MESSAGE)
  // IF IS IN CHATLIST WE UPDATE CHATLIST
  // IF IS IN RECORDEDCHAT UPDATE CHATLIST AND ADD THE MESSAGE TO RECORDEDCHATS[CONVERSATIONID]
  // IF IS CURRENTCHAT UPDATE CURRENTCHAT

  private getConversation(id: string, next?): void {
    this.currentMessage.conversationId = id;
    if (this.recordedChats[id]) {
      this.currentChat = this.recordedChats[id];
    } else {
      this.chatService.listConversation(id).subscribe((data) => {
        this.currentChat = data;
        this.recordedChats[id] = data;
        if (next) { next(data); }
      });
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
