import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { ChatService } from 'app/private/services';
import { Chat } from 'app/private/models/chat';
import { UserService } from 'app/private/services';
import { User } from 'app/interfaces';
import 'rxjs/add/operator/map';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'chat-page',  // <chat-page></chat-page>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [

  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./chatPage.component.scss'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './chatPage.component.html'
})
export class ChatPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('list') private list: ElementRef;
  /**
   * TypeScript public modifiers
   */
  private currentMsg = '';

  private currentUser = '';

  private chargedChat = [];

  private users = [];

  constructor(
    private chat: ChatService,
    private userService: UserService
  ) { }

  public ngOnInit() {

    console.log('hello `ChatPage` component');
    this.chat.listConversations((err, conversations) => {
      if (err) {
        console.log(err);
      } else {
        // tslint:disable-next-line:max-line-length
        conversations.map((conversation) => {
          // tslint:disable-next-line:max-line-length
          this.users.push({ id: conversation.participants._id, username: conversation.participants.username });
          if (this.users.length === conversations.length) {
            // this.chat.getOldMessages(conversation.conversationID, (error, data) => {
            //   if (error) {
            //     console.log(error);
            //   } else {
            //     console.log(data);
            //   }
            // });
          }
        });
      }
    });
  }

  public ngAfterViewChecked() {
    this.scrollToBottom();
  }

  public refreshForm(userID) {
    this.currentMsg = '';
    this.currentUser = userID;
  }

  public chatWith() {

    if (this.currentMsg.length && this.currentUser.length) {
      this.chat.newChat(this.currentUser, this.currentMsg);
      this.currentMsg = '';
    }

  }

  public send() {
    if (this.currentMsg.length) {

      if (this.chat.activeChat && this.chat.activeChat.msgList) {
        this.chat.activeChat.send(this.currentMsg, {recipient: this.currentUser});
        this.currentMsg = '';
      } else {
        this.chatWith();
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
