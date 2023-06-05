// Template Modules
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from "./settings-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAccordionModule,
  NgbActiveModal,
  NgbAlertModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbRatingModule,
  NgbTooltipModule,
  NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { SimplebarAngularModule } from "simplebar-angular";
import { SwiperModule } from "ngx-swiper-wrapper";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { FlatpickrModule } from "angularx-flatpickr";
import { NgSelectModule } from "@ng-select/ng-select";
import { CountToModule } from "angular-count-to";
import { SharedModule } from "app/shared/shared.module";
import { NgxMaskModule } from "ngx-mask";
import { SharedDirectivesModule } from "@shared/directives/shared-directives.module";
import { SharedPipesModule } from '@shared/pipes/pipes.module';
import { ReactiveValidationModule } from "angular-reactive-validation";
// Components
import { CountriesComponent } from './components/countries/countries.component';
import { SharedComponentsModule } from "@shared/components/shared-components.module";
import { SettingsComponent } from './components/settings/settings.component';
import {
  UserTermsAndConditionsComponent
} from './components/settings/user-terms-and-conditions/user-terms-and-conditions.component';
import {
  VendorTermsAndConditionsComponent
} from './components/settings/vendor-terms-and-conditions/vendor-terms-and-conditions.component';
import { VerificationFileComponent } from './components/settings/verification-file/verification-file.component';
import {
  ConfigurationUpdateComponent
} from './components/settings/configuration-update/configuration-update.component';
import { CustomPdfViewerModule } from "@libs/custom-pdf-viewer/custom-pdf-viewer.module";
import {
  AddEditEventTypeComponent
} from "app/+settings/components/event-type/add-edit-event-type/add-edit-event-type.component";
import { EventTypesComponent } from "app/+settings/components/event-type/event-types/event-types.component";
import { PrimengTableModule } from "@libs/primeng-table/primeng-table.module";
import { SettingsAuditsComponent } from './components/settings-audits/settings-audits.component';
import { AuditsComponent } from './components/settings-audits/audits/audits.component';
import { ActivityItemTitleComponent } from './components/settings-audits/audits/activity-item-title/activity-item-title.component';
import { PreviewActivityChangesComponent } from './components/settings-audits/audits/preview-activity-changes/preview-activity-changes.component';
import { EventTypeSliderComponent } from './components/event-type/slider/slider.component';
import { SliderHeaderComponent } from './components/event-type/slider/header/header.component';
import { AuditsTabComponent } from './components/event-type/slider/audit-tab/audit-tab.component';
import { ActivityItemContentComponent } from './components/settings-audits/audits/activity-item-content/activity-item-content.component';

@NgModule({
  declarations: [
    CountriesComponent,
    SettingsComponent,
    VendorTermsAndConditionsComponent,
    UserTermsAndConditionsComponent,
    VerificationFileComponent,
    ConfigurationUpdateComponent,
    AddEditEventTypeComponent,
    EventTypesComponent,
    SettingsAuditsComponent,
    AuditsComponent,
    ActivityItemTitleComponent,
    PreviewActivityChangesComponent,
    EventTypeSliderComponent,
    SliderHeaderComponent,
    AuditsTabComponent,
    ActivityItemContentComponent
  ],
  imports: [
    SettingsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbRatingModule,
    NgbTooltipModule,
    NgxSliderModule,
    NgbModule,
    SimplebarAngularModule,
    SwiperModule,
    CKEditorModule,
    DropzoneModule,
    FlatpickrModule.forRoot(),
    NgSelectModule,
    CountToModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    SharedDirectivesModule,
    SharedComponentsModule,
    SharedPipesModule,
    ReactiveValidationModule,
    CustomPdfViewerModule,
    PrimengTableModule
  ],
  providers: [
    NgbActiveModal
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SettingsModule {
}
