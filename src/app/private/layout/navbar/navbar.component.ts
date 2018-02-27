import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService, SearchService } from 'app/private/services';
import { IUser } from 'app/private/interfaces';

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
  public search: string;
  public focused: boolean = false;
  public listUsersSearch: [IUser] | IUser[];
  public searchDelay: number = 1000;
  public currentDelay: number = 1000;
  /**
   * TypeScript public modifiers
   */

  public currentWindowWidth: number = 0;
  public displaySearch: boolean = false;
  public user: IUser;
  public languajes: string[];

  private submenus = {
    notification: false,
    message: false,
    languaje: false,
    setting: false
  };

  constructor(
    private commonData: CommonService,
    private translateService: TranslateService,
    private searchService: SearchService
  ) { }

  public ngOnInit() {
    this.currentWindowWidth = window.innerWidth;
    this.languajes = this.translateService.getLangs();
    this.commonData.currentUser.subscribe((data) => {
      this.user = data;
    });
  }

  @HostListener('window:resize')
  public onResize() {
    if (window.innerWidth > 500 && this.currentWindowWidth <= 500) {
      this.displaySearch = false;
    }
    this.currentWindowWidth = window.innerWidth;
  }

  public resetSearcher() {
    this.search = '';
    this.listUsersSearch = null;
  }

  public onUnfocus() {
    setTimeout(() => {
      this.focused = false;
    }, 100);
  }

  public searcher(event?) {
    if (event && event.key === 'Backspace' && this.search.length === 0) {
      this.listUsersSearch = null;
    }
    if (this.currentDelay === 0 && this.search.length > 0) {
      this.searchService.getUserByPartial(this.search).subscribe((users: [IUser]) => {
        this.listUsersSearch = users;
      });
      this.currentDelay = this.searchDelay;
    } else if (this.currentDelay === this.searchDelay) {
      this.currentDelay--;
      setTimeout(() => {
        this.currentDelay = 0;
        this.searcher();
      }, this.currentDelay);
    }
  }

  public onFocus() {
    this.focused = true;
    if (this.currentWindowWidth > 500) {
      this.displaySearch = true;
    }
  }

  public onBlur() {
    this.focused = false;
    if (this.currentWindowWidth > 500) {
      this.displaySearch = false;
    }
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

  public changeLang(lang: string) {
    this.translateService.use(lang);
  }

}
