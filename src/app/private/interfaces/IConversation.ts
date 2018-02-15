
import { IMessage } from './IMessage';
import { IUser } from './IUser';

export interface IConversation {
  conversationId?: string;
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
