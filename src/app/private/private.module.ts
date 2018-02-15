import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared';
import { CoreModule } from 'app/core';
import { CommonModule } from '@angular/common';

import { routes } from 'app/private/private.routes';
import { PrivateComponent } from 'app/private/private.component';
import { PrivateService } from 'app/private/services';
import { NavbarComponent } from 'app/private/layout/navbar';
import { ChatComponent } from 'app/private/layout/chat';
import { PostListComponent } from 'app/private/post-list';
import { ChatPageComponent } from 'app/private/chat';
import { ChatPage2Component } from 'app/private/chat';
import { CommonService } from 'app/private/services';
import { ChatService } from 'app/private/services';
import { ChatService2 } from 'app/private/services';
import { UserService } from 'app/private/services';

const APP_PROVIDERS = [];

console.log('`Private` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    NavbarComponent,
    ChatComponent,
    PrivateComponent,
    PostListComponent,
    ChatPageComponent,
    ChatPage2Component
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
    ChatService2,
    CommonService,
    ChatService,
    UserService
  ]
})

export class PrivateModule {
  public static routes = routes;
}
