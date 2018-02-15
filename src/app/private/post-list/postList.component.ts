
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
  selector: 'post-list',  // <post-list></post-list>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [

  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./postList.component.scss'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './postList.component.html'
})
export class PostListComponent implements OnInit, AfterViewInit {
  /**
   * TypeScript public modifiers
   */

  public ngOnInit() {

    console.log('hello `PostList` component');
  }

  public ngAfterViewInit() {
    console.log('view');
  }

}
