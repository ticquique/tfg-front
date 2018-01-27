export class User {
  public id: String;
  public email: String;
  public username: String;
  public role: String;
  public points: {
    numLikes?: Number,
    numComments?: Number,
    firstReg?: Number
  };
  public numComments: Number;
  public dislikes: String[];
  public likes: String[];
  public posts: String[];
  public privileges?: String;
  public langKey?: string;

}
