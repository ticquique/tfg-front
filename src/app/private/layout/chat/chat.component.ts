import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'chat',  // <chat></chat>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [

  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./chat.component.scss'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, AfterViewInit {
  /**
   * TypeScript public modifiers
   */

  public ngOnInit() {

    console.log('hello `Chat` component');
  }

  public ngAfterViewInit() {
    console.log('view');
  }

}
