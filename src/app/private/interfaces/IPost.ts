import { IUser, ILike, IAttachment } from '.';

export interface IPost {
  _id?: string;
  title?: string;
  message?: string;
  attachments?: IAttachment;
  creator?: IUser;
  likes?: ILike;
  dislikes?: ILike;
  created_at?: Date;
  updated_at?: Date;
  __v?: number;
}
