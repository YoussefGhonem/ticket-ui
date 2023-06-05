import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsModule } from "./layouts/layouts.module";


// Auth
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// @shared
import { ErrorInterceptor } from "@shared/interceptors/error.interceptor";
import { HeadersInterceptor } from "@shared/interceptors/headers.interceptor";
import { JwtInterceptor } from "app/+auth/helpers";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPermissionsModule } from "ngx-permissions";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    Ng2SearchPipeModule,
    NgxPermissionsModule.forRoot(),
    NgxSpinnerModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
