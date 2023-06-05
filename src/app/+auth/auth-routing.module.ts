import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "app/+auth/components/login/login.component";
import { ForgotPasswordComponent } from "app/+auth/components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "app/+auth/components/reset-password/reset-password.component";
import { SignupComponent } from "app/+auth/components/signup/signup.component";

//#region Errors
import { Page401Component } from './errors/page401/page401.component';
import { Page402Component } from './errors/page402/page402.component';
import { Page404Component } from './errors/page404/page404.component';
import { Page500Component } from './errors/page500/page500.component';
import { TermsAndConditionsComponent } from "app/+auth/components/terms-and-conditions/terms-and-conditions.component";
//#endregion

// Components

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "terms-and-conditions",
    component: TermsAndConditionsComponent,
  },
  {
    path: "not-found",
    component: Page404Component
  },
  {
    path: "server-error",
    component: Page500Component
  },
  {
    path: "unauthorized",
    component: Page401Component
  },
  {
    path: "unauthenticated",
    component: Page402Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {

}
