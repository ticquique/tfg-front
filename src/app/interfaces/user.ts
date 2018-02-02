export interface User {
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
  dislikes?: string[];
  likes?: string[];
  posts?: string[];
  privileges?: string;
  langKey?: string;
  id?: string;

}
