// Template Modules
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { VendorsRoutingModule } from './vendors-routing.module';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { PrimengTableModule } from "@libs/primeng-table/primeng-table.module";
import { CommiteeMembersComponent } from './components/commitee-members/commitee-members.component';
import { CreateMemberComponent } from './components/commitee-members/create-member/create-member.component';
import { ChangeRoleComponent } from './components/commitee-members/change-role/change-role.component';
import { PreviewSliderComponent } from './components/preview-slider/preview-slider.component';
import { DetailsTabComponent } from './components/preview-slider/details-tab/details-tab.component';
import { SliderHeaderComponent } from './components/preview-slider/slider-header/slider-header.component';
import { AuditsTabComponent } from './components/preview-slider/audits-tab/audits-tab.component';
import { AssignedEventsComponent } from './components/preview-slider/assigned-events/assigned-events.component';
import { EventFiltersComponent } from './components/preview-slider/assigned-events/event-filters/event-filters.component';
import { EventsCardComponent } from './components/preview-slider/assigned-events/events-card/events-card.component';
import { EventBadgeDirectivesModule } from 'app/+events/directives/Badges/event-badge-directives.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AuditsComponent } from './components/preview-slider/audits-tab/audits/audits.component';
import { ActivityItemTitleComponent } from './components/preview-slider/audits-tab/audits/activity-item-title/activity-item-title.component';
import { PreviewActivityChangesComponent } from './components/preview-slider/audits-tab/audits/preview-activity-changes/preview-activity-changes.component';
import { ActivityItemContentComponent } from './components/preview-slider/audits-tab/audits/activity-item-content/activity-item-content.component';


@NgModule({
  declarations: [
    CommiteeMembersComponent,
    CreateMemberComponent,
    ChangeRoleComponent,
    PreviewSliderComponent,
    DetailsTabComponent,
    SliderHeaderComponent,
    AuditsTabComponent,
    AssignedEventsComponent,
    EventFiltersComponent,
    EventsCardComponent,
    AuditsComponent,
    ActivityItemTitleComponent,
    PreviewActivityChangesComponent,
    ActivityItemContentComponent
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
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
    PrimengTableModule,
    EventBadgeDirectivesModule,
    NgxPermissionsModule.forChild()
  ],
  providers: [
    NgbActiveModal
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class VendorsModule {
}
