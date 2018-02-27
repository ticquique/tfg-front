import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from 'app/shared/services';
import { ValidForm } from 'app/interfaces';
import { lostValidation } from 'app/shared/validators';

@Component({
  selector: 'lost-form',  // <lost-form></lost-form>
  providers: [],
  styleUrls: ['./lost.component.scss'],
  templateUrl: './lost.component.html',
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

export class LostComponent implements OnInit {

  // Variables
  @Output() public cancelled = new EventEmitter();
  @Output() public submitted = new EventEmitter();
  @Output() public login = new EventEmitter();

  public state: string = 'invisible';
  public errorState: string = 'invisible';
  public successState: string = 'invisible';
  public errors: string = '';
  public logModel = {
    email: '',
    username: ''
  };

  // Methods
  constructor(
    private authService: AuthService
  ) { }

  public ngOnInit() {
    console.log('hello `recoverPass` component');
    setTimeout(() => {
      this.state = 'visible';
    }, 60);
  }

  public logg() {
    this.state = 'invisible';
    setTimeout(() => {
      this.login.emit(null);
    }, 300);
  }

  public cancel(event) {

    this.state = 'invisible';
    setTimeout(() => {
      this.cancelled.emit(null);
    }, 300);
  }

  public submit(event) {

    // Variables
    const email: string = this.logModel.email;
    const username: string = this.logModel.username;

    const isValid: ValidForm = lostValidation(email, username);

    // Methods
    if (isValid.success) {
      this.authService.recoverPass(email, username, (err, data) => {
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
