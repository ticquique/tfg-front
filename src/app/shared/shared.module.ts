import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'app/shared/services';
import { PublicService } from 'app/shared/services';
import { AuthGuard } from 'app/shared/guards';
import { FormsModule } from '@angular/forms';

const APP_PROVIDERS = [
  AuthGuard,
  AuthService,
  PublicService
];

console.log('`Shared` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
  ],
  imports: [

  ],
  exports: [
    FormsModule
  ],
  providers: [

  ]
})

export class SharedModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: APP_PROVIDERS
    };
  }

  constructor() {console.log('Shared module charged'); }
}
