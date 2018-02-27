import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared';
import { CoreModule } from 'app/core';
import { CommonModule } from '@angular/common';

import { routes } from 'app/private/private.routes';
import { PrivateComponent } from 'app/private/private.component';
import { NavbarComponent } from 'app/private/layout/navbar';
import { PostListComponent, PostComponent } from 'app/private/post-list';
import { ChatPageComponent } from 'app/private/chat';
import { SettingsComponent } from 'app/private/settings';
import { ProfileComponent } from 'app/private/profile';
import {
  CommonService, ChatService, UserService, PrivateService, SearchService, PostService
} from 'app/private/services';

const APP_PROVIDERS = [];

console.log('`Private` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    NavbarComponent,
    PrivateComponent,
    PostListComponent,
    ChatPageComponent,
    SettingsComponent,
    ProfileComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    CoreModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports: [

  ],
  providers: [
    PrivateService,
    ChatService,
    CommonService,
    UserService,
    SearchService,
    PostService
  ]
})

export class PrivateModule {
  public static routes = routes;
}
