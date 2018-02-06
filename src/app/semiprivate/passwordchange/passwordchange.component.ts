import {
  Component,
  OnInit
} from '@angular/core';

import { AuthService } from 'app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Route } from '@angular/router/src/config';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'passwordchange',  // <passwordchange></passwordchange>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [

  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./passwordchange.component.scss'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './passwordchange.component.html',
  animations: [
    trigger('onLoad', [
      state('invisible', style({
        opacity: '0'
      })),
      state('visible', style({
        opacity: '1'
      })),
      transition('invisible <=> visible', animate('400ms ease-in')),
    ]),
    trigger('onError', [
      state('invisible', style({
        height: '0rem',
        opacity: '0'
      })),
      state('visible', style({
        height: '27px',
        opacity: '1'
      })),
      transition('invisible <=> visible', animate('600ms ease-in')),
    ]),
    trigger('onSuccess', [
      state('invisible', style({
        height: '0rem',
        opacity: '0'
      })),
      state('visible', style({
        height: '27px',
        opacity: '1'
      })),
      transition('invisible <=> visible', animate('600ms ease-in')),
    ])
  ]
})
export class PasswordChangeComponent implements OnInit {
  /**
   * TypeScript public modifiers
   */
  private token: string;
  private tokenError: string = '';

  private state: string = 'invisible';
  private errorState: string = 'invisible';
  private successState: string = 'invisible';
  private passwordHide: boolean = true;
  private errors: string = '';
  private logModel = {
    password: ''
  };

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit() {
    setTimeout(() => {
      this.state = 'visible';
    }, 60);
    if (this.route.snapshot.queryParams.type === 'r') {
      this.authService.confirmPasswordChange(this.route.snapshot.params.token, (err, data) => {
        if (err) { this.tokenError = err; }
        if (data) {
          this.token = data;
          this.authService.storeUserData(data.token, true);
        }
      });
    } else if (this.route.snapshot.queryParams.type === 'n') {
      this.authService.confirmMail(this.route.snapshot.params.token, (err, data) => {
        if (err) { this.tokenError = err; }
        if (data) {
          this.token = data;
          this.authService.storeUserData(data.token, true);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  public cancel(event) {

    this.state = 'invisible';
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300);
  }

  public submit(event) {

    this.state = 'invisible';
    this.authService.firstProfileUpdate(this.logModel, (err, data) => {
      if (err) {
        this.errors = err.error.message;
        this.errorState = 'visible';
        setTimeout(() => { this.errorState = 'invisible'; }, 1500);
        return false;
      }
      if (data) {
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 300);
      }
    });
  }

}
