import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared';
import { CoreModule } from 'app/core';
import { CommonModule } from '@angular/common';

import { routes } from 'app/private/private.routes';
import { PrivateComponent } from 'app/private/private.component';
import { PrivateService } from 'app/private/private.service';

const APP_PROVIDERS = [];

console.log('`Private` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    PrivateComponent
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
    PrivateService
  ]
})

export class PrivateModule {
  public static routes = routes;
}
