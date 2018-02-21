import { ILike, IPost } from '.';

export interface IUser {
  email?: string;
  password?: string;
  username?: string;
  role?: string;
  points?: {
    numLikes?: number,
    numComments?: number,
    firstReg?: number
  };
  numComments?: number;
  dislikes?: ILike[];
  likes?: ILike[];
  posts?: IPost[];
  privileges?: string;
  langKey?: string;
  id?: string;
  _id?: string;
  profile?: {
    city?: string,
    country?: string,
    age?: number,
    sex?: string,
    phone?: string,
    hobbies?: [string] | string[]
  };
}
