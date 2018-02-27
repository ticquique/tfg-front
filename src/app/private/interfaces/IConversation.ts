
import { IMessage } from './IMessage';
import { IUser } from './IUser';

export interface IConversation {
  conversationID?: string;
  participants?: IUser[];
  notOpened?: number;
  message?: IMessage;
  numMessages?: number;
  messages?: IMessage[];
}

export interface ListConversations {
  conversations: IConversation[];
  notOpened: number;
}

export interface RecordedChat {
  [name: string]: IConversation;
}
