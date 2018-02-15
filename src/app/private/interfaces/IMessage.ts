import { IUser } from './IUser';

export interface IMessage {
  _id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  conversationId?: string;
  body?: string;
  author?: IUser;
  __v?: number;
  toOpen?: [IUser] | IUser[];
}
