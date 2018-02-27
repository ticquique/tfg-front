import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'app/core/interceptor';

const APP_PROVIDERS = [
  TranslateService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
];

console.log('`Core` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
  ],
  imports: [

  ],
  exports: [
    TranslateModule,
  ],
  providers: [

  ]
})

export class CoreModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: APP_PROVIDERS
    };
  }

  constructor() {console.log('Core module charged'); }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
