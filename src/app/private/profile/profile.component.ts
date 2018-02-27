
import {
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonService, UserService } from 'app/private/services';
import { IUser } from '../interfaces';

@Component({
  selector: 'profile',
  providers: [

  ],
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  public routeName: string;
  public profileUser: IUser;
  public allowVisible: boolean;
  private user: IUser;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private userService: UserService
  ) { }

  public async ngOnInit() {
    this.user = await this.getCurrentUser();
    this.route.params.subscribe(
      (params) => {
        if (params['username'] && params['username'] !== this.user.username) {
          this.routeName = params['username'];
        } else {
          this.routeName = this.user.username;
        }
        this.initializeProfile();
      },
      (err) => { console.log(err); }
    );
    console.log('hello `Profile` component');
  }

  public swapFollow(id: string) {
    this.userService.followUser(id, (err, data) => {
      if (data === 'added') {
        if (this.profileUser.privacy === 'semirestricted') {
          this.allowVisible = true;
        }
      } else {
        if (this.profileUser.privacy === 'semirestricted') {
          this.allowVisible = false;
        }
      }
    });
  }

  private initializeProfile() {
    this.getUserProfile().then(
      (user) => {

        if (user.privacy === 'public') {
          this.profileUser = user;
          this.allowVisible = true;
        } else if (user.privacy === 'semirestricted') {
          this.userService.getFolloweds(user._id, (err, data) => {
            if (data.find((element) => element === this.user._id)) {
              this.profileUser = user;
              this.allowVisible = true;
            } else {
              this.profileUser = user;
              this.allowVisible = false;
            }
          });
        } else if (user.privacy === 'restricted') {
          this.userService.getFollows(user._id, (err, data) => {
            if (data.find((element) => element === this.user._id)) {
              this.profileUser = user;
              this.allowVisible = true;
            } else {
              this.allowVisible = false;
            }
          });
        } else {
          if (this.user.username === user.username) {
            this.profileUser = user;
            this.allowVisible = true;
          } else {
            this.allowVisible = false;
          }
        }
      });
  }

  private getCurrentUser(): Promise<IUser> {
    return new Promise<IUser>((resolve) => {
      if (!this.user) {
        this.commonService.currentUser.subscribe(
          (user) => {
            resolve(user);
          });
      } else {
        resolve(this.user);
      }
    });
  }

  private getUserProfile(): Promise<IUser> {
    return new Promise<IUser>((resolve) => {
      this.userService.getUserProfile(this.routeName, (err, userProfile) => {
        resolve(userProfile);
      });
    });
  }

}
