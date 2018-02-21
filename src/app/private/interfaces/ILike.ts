
import { IUser } from './IUser';

export interface ILike {
  _id?: string;
  user?: IUser;
  related?: string;
  relatedUp?: boolean;
  created_at?: Date;
  updated_at?: Date;
  __v?: number;
}
