import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'home',  // <home></home>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [

  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./home.component.scss'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  /**
   * TypeScript public modifiers
   */
  public currentWindowWidth: number;

  public loginOpen = false;
  public lostOpen = false;

  public ngOnInit() {
    console.log('hello `Home` component');
    this.currentWindowWidth = window.innerWidth;
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
  }

  @HostListener('window:resize')
  public onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  public openLogin() {
    this.lostOpen = false;
    this.loginOpen = !this.loginOpen;
  }

  public openLost() {
    this.loginOpen = false;
    this.lostOpen = !this.lostOpen;
  }

}
