import {
  Component,
  OnInit,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService, PublicService } from 'app/shared/services';
import { ValidForm, User } from 'app/interfaces';
import { registerValidation } from 'app/shared/validators';

@Component({
  selector: 'register-form',  // <register-form></register-form>
  providers: [],
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
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

export class RegisterComponent implements OnInit {

  // Variables
  @Output() public cancelled = new EventEmitter();
  @Output() public submitted = new EventEmitter();

  public state: string = 'invisible';
  public errorState: string = 'invisible';
  public successState: string = 'invisible';
  public errors: string = '';
  public roles: [string];
  private logModel = {
    email: '',
    username: '',
    role: ''
  };

  // Methods
  constructor(
    private authService: AuthService,
    private publicService: PublicService
  ) { }

  public ngOnInit() {
    console.log('hello `Register` component');
    this.publicService.getRoles((err, data) => {
      if (err) { console.log(err); }
      if (data) {
        console.log(data);
        this.roles = data.roles;
        this.logModel.role = data.roles[0]._id;
      }
    });
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
      email: this.logModel.email,
      role: this.logModel.role
    };

    const isValid: ValidForm = registerValidation(user);

    // Methods
    if (isValid.success) {
      this.authService.registerUser(user, (err, data) => {
        if (err) {
          this.errors = err.error.message;
          this.errorState = 'visible';
          setTimeout(() => { this.errorState = 'invisible'; }, 1500);
          return false;
        } else {
          this.successState = 'visible';
          setTimeout(() => {
            this.successState = 'invisible';
            setTimeout(() => {
              this.state = 'invisible';
              setTimeout(() => {
                this.submitted.emit(null);
              }, 300);
              return true;
            }, 600);
          }, 1500);
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
