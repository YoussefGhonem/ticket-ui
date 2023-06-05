import { AuditsTabComponent } from './components/users/preview-slider/audits-tab/audits-tab.component';
import { DetailsTabComponent } from './components/users/preview-slider/details-tab/details-tab.component';
import { SliderHeaderComponent } from './components/users/preview-slider/header/header.component';
import { PreviewSliderComponent } from './components/users/preview-slider/preview-slider.component';
import { EventsTabComponent } from './components/users/preview-slider/events-tab/events-tab.component';
import { EventTabFiltersComponent } from './components/users/preview-slider/events-tab/event-tab-filters/event-tab-filters.component';
import { EventsTabCardComponent } from './components/users/preview-slider/events-tab/events-tab-card/events-tab-card.component';
import { UsersComponent } from './components/users/users.component';
// Libs
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAccordionModule,
  NgbActiveModal,
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbRatingModule,
  NgbToastModule,
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
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { SharedPipesModule } from '@shared/pipes/pipes.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersTableComponent } from './components/users/users-table/users-table.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ChangePasswordComponent } from './components/profile-settings/change-password/change-password.component';
import {
  UpdateUserProfileComponent
} from './components/profile-settings/update-user-profile/update-user-profile.component';
import {
  UpdateProfileImageComponent
} from './components/profile-settings/update-profile-image/update-profile-image.component';
import {
  VerificationTabComponent
} from './components/profile-settings/verification-document/verification-document.component';
import { ReactiveValidationModule } from 'angular-reactive-validation';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { NgxPermissionsModule } from "ngx-permissions";
import { CustomPdfViewerModule } from "@libs/custom-pdf-viewer/custom-pdf-viewer.module";
import { PrimengTableModule } from "@libs/primeng-table/primeng-table.module";
import { AssignedEventsComponent } from './components/users/preview-slider/assigned-events/assigned-events.component';
import { EventBadgeDirectivesModule } from 'app/+events/directives/Badges/event-badge-directives.module';
import { EventFiltersComponent } from './components/users/preview-slider/assigned-events/event-filters/event-filters.component';
import { EventsCardComponent } from './components/users/preview-slider/assigned-events/events-card/events-card.component';
import { CommitteeMembersTabComponent } from './components/users/preview-slider/committee-members-tab/committee-members-tab.component';
import { CommitteeMembersTabTableComponent } from './components/users/preview-slider/committee-members-tab/committee-members-tab-table/committee-members-tab-table';
import { CommitteeMembersTabFiltersComponent } from './components/users/preview-slider/committee-members-tab/committee-members-tab-filters/committee-members-tab-filters';
import { VendorAdminTabComponent } from './components/users/preview-slider/vendor-admin-tab/vendor-admin-tab.component';
import { VendorAdminTabTableComponent } from './components/users/preview-slider/vendor-admin-tab/vendor-admin-tab-table/vendor-admin-tab-table.component';
import { VendorAdminTabFilterComponent } from './components/users/preview-slider/vendor-admin-tab/vendor-admin-tab-filters/vendor-admin-tab-filter.component';
import { AuditsComponent } from './components/users/preview-slider/audits-tab/audits/audits.component';
import { ActivityItemTitleComponent } from './components/users/preview-slider/audits-tab/audits/activity-item-title/activity-item-title.component';
import { PreviewActivityChangesComponent } from './components/users/preview-slider/audits-tab/audits/preview-activity-changes/preview-activity-changes.component';
import { ActivityItemContentComponent } from './components/users/preview-slider/audits-tab/audits/activity-item-content/activity-item-content.component';
import { AuditsBodyComponent } from './components/profile/audits-body/audits-body.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    UsersComponent,
    UsersTableComponent,
    CreateUserComponent,
    ProfileComponent,
    ProfileSettingsComponent,
    ChangePasswordComponent,
    UpdateUserProfileComponent,
    UpdateProfileImageComponent,
    VerificationTabComponent,
    UsersComponent,
    PreviewSliderComponent,
    SliderHeaderComponent,
    DetailsTabComponent,
    AuditsTabComponent,
    EventFiltersComponent,
    EventsCardComponent,
    AssignedEventsComponent,
    EventsTabComponent,
    EventTabFiltersComponent,
    EventsTabCardComponent,
    CommitteeMembersTabFiltersComponent,
    CommitteeMembersTabTableComponent,
    CommitteeMembersTabComponent,
    VendorAdminTabComponent,
    VendorAdminTabTableComponent,
    VendorAdminTabFilterComponent,
    AuditsComponent,
    AuditsBodyComponent,
    ActivityItemTitleComponent,
    PreviewActivityChangesComponent,
    ActivityItemContentComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbToastModule,
    NgbAccordionModule,
    NgbRatingModule,
    NgbTooltipModule,
    NgxSliderModule,
    SimplebarAngularModule,
    SwiperModule,
    CKEditorModule,
    DropzoneModule,
    PrimengTableModule,
    FlatpickrModule.forRoot(),
    NgSelectModule,
    CountToModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    SharedDirectivesModule,
    SharedComponentsModule,
    SharedPipesModule,
    AutocompleteLibModule,
    SignaturePadModule,
    PdfViewerModule,
    NgxPermissionsModule.forChild(),
    ReactiveValidationModule,
    CustomPdfViewerModule,
    EventBadgeDirectivesModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE',
      libraries: ["places"]
    }),
  ],
  providers: [
    NgbActiveModal
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule {
}
