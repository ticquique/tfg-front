import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'navbar-priv',  // <navbar></navbar>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [

  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./navbar.component.scss'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  /**
   * TypeScript public modifiers
   */

  private submenus = {
    notification: false,
    message: false,
    languaje: false,
    setting: false
  };

  public ngOnInit() {

    console.log('hello `Navbar` component');
  }

  public submenuToogle(type?) {
    Object.keys(this.submenus).map((key) => {
      if (type && key === type) {
        this.submenus[key] = !this.submenus[key];
      } else {
        this.submenus[key] = false;
      }
    });
  }

}
