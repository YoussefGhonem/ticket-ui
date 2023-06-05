import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedDirectivesModule } from "@shared/directives/shared-directives.module";
import { SharedPipesModule } from "@shared/pipes/pipes.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ReactiveValidationModule } from "angular-reactive-validation";
import { NgxMaskModule } from "ngx-mask";
import { NgbModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ActivateComponent } from "@shared/components/activate/activate.component";
import { DeactivateComponent } from "@shared/components/deactivate/deactivate.component";
import { DeleteComponent } from './delete/delete.component';
import { UnlockComponent } from './unlock/unlock.component';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { defineLordIconElement } from "lord-icon-element";
import lottie from 'lottie-web';
import {
  ValidationPasswordOptionsComponent
} from 'app/+auth/components/validation-password-options/validation-password-options.component';
import { UserInfoComponent } from './user-info/user-info.component';

@NgModule({
  declarations: [
    ActivateComponent,
    DeactivateComponent,
    DeleteComponent,
    ValidationPasswordOptionsComponent,
    PaginationComponent,
    UnlockComponent,
    UserInfoComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    SharedDirectivesModule,
    SharedPipesModule,
    ReactiveFormsModule,
    ReactiveValidationModule,
    NgxMaskModule.forRoot(),
    NgbTooltipModule,

  ],
  exports: [
    ActivateComponent,
    SharedPipesModule,
    DeactivateComponent,
    ValidationPasswordOptionsComponent,
    PaginationComponent,
    UserInfoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SharedComponentsModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
