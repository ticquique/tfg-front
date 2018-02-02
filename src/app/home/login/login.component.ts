import {
  Component,
  OnInit,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'app/shared/services';
import { User } from 'app/interfaces';
import { ValidForm } from 'app/interfaces';
import { loginValidation } from 'app/shared/validators';

@Component({
  selector: 'login-form',  // <login-form></login-form>
  providers: [],
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
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
    ])
  ]
})

export class LoginComponent implements OnInit {

  // Variables
  @Output() public cancelled = new EventEmitter();
  @Output() public submitted = new EventEmitter();
  public state: string = 'invisible';
  public errorState: string = 'invisible';
  public errors: string = '';
  public passwordHide: boolean = true;
  public lostPass: boolean = true;
  private logModel = {
    username: '',
    password: '',
    remember: false
  };

  // Methods
  constructor(
    private authService: AuthService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  public ngOnInit() {
    console.log('hello `Login` component');
    setTimeout(() => {
      this.state = 'visible';
    }, 60);
  }

  public cancel(event) {

    this.state = 'invisible';
    setTimeout(() => {
      this.cancelled.emit(null);
    }, 300);
  }

  public submit(event) {

    // Variables
    const user: User = {
      username: this.logModel.username,
      password: this.logModel.password
    };

    const isValid: ValidForm = loginValidation(user);

    // Methods
    if (isValid.success) {
      this.authService.authenticateUser(user, (err, data) => {
        if (err) {
          this.errors = err.error.message;
          this.errorState = 'visible';
          setTimeout(() => { this.errorState = 'invisible'; }, 1500);
          return false;
        } else {
          this.state = 'invisible';
          this.authService.storeUserData(data.token, this.logModel.remember);
          setTimeout(() => {
            this.activatedRoute.queryParams.subscribe((params: Params) => {
              if (params.returnUrl) {
                this.router.navigate([params.returnUrl]);
              } else {
                this.router.navigate(['/']);
              }
            });
            this.cancelled.emit(null);
          }, 300);
          return true;
        }
      });
    } else {
      this.errors = isValid.message;
      this.errorState = 'visible';
      setTimeout(() => { this.errorState = 'invisible'; }, 1500);
      return false;
    }
  }

}
