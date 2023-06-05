import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileViewerAndSignatureComponent } from './components/file-viewer-and-signature/file-viewer-and-signature.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from "app/+auth/auth-routing.module";
// Libs
import { NgbActiveModal, NgbCarouselModule, NgbModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxMaskModule } from "ngx-mask";
import { SignaturePadModule } from '@ng-plus/signature-pad';
// @shared
import { SharedDirectivesModule } from "@shared/directives/shared-directives.module";
// Components
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from "app/+auth/components/signup/signup.component";
import { LoginComponent } from "app/+auth/components/login/login.component";
import { ForgotPasswordComponent } from "app/+auth/components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "app/+auth/components/reset-password/reset-password.component";
import { defineLordIconElement } from "lord-icon-element";
import lottie from "lottie-web";

//#region
import { Page401Component } from './errors/page401/page401.component';
import { Page402Component } from './errors/page402/page402.component';
import { Page404Component } from './errors/page404/page404.component';
import { Page500Component } from './errors/page500/page500.component';
import { ReactiveValidationModule } from 'angular-reactive-validation';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { SharedPipesModule } from '@shared/pipes/pipes.module';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { NgSelectModule } from '@ng-select/ng-select';

//#endregion

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    Page401Component,
    Page402Component,
    Page404Component,
    Page500Component,
    TermsAndConditionsComponent,
    FileViewerAndSignatureComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NgbModule,
    NgSelectModule,
    NgbCarouselModule,
    NgbToastModule,
    SharedDirectivesModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ReactiveValidationModule,
    SharedComponentsModule,
    SharedPipesModule,
    SignaturePadModule,
    PdfViewerModule
  ],
  providers: [
    NgbActiveModal
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AuthModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
