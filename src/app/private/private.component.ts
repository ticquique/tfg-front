import {
  Component,
  OnInit,
  ViewChild,
  HostListener
} from '@angular/core';
import { PrivateService } from 'app/private/services';
import { ChatService } from './services';
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Private` component loaded asynchronously');

@Component({
  selector: 'private',
  styleUrls: ['./private.component.scss'],
  templateUrl: './private.component.html'
})
export class PrivateComponent implements OnInit {

  @ViewChild('navbarRef') public navbar;
  private isValidToken = false;

  constructor(
    private privateService: PrivateService,
    private chatService: ChatService
  ) { }

  public ngOnInit() {

    this.privateService.authenticateUser()
      .subscribe(
      (data) => { this.isValidToken = true; },
      (err) => { this.isValidToken = false; }
      );

    console.log('hello `Private` component');
  }

}
