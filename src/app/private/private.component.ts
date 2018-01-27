import {
  Component,
  OnInit,
} from '@angular/core';
import { PrivateService } from 'app/private/private.service';
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Private` component loaded asynchronously');

@Component({
  selector: 'private',
  template: `
    <div *ngIf="isValidToken">
      <nav>
        <li>Logo</li>
        <li>Register</li>
        <li>Login</li>
      </nav>

      <h1>Hello from Private</h1>
      <span>{{isValidToken}}</span>
    </div>
  `,
})
export class PrivateComponent implements OnInit {

  public isValidToken = false;

  constructor(public privateService: PrivateService) { }

  public ngOnInit() {

    this.privateService.authenticateUser()
      .subscribe(
      (data) => { this.isValidToken = true; },
      (err) => { this.isValidToken = false; }
      );

    console.log('hello `Private` component');
  }

}
