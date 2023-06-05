import { LocationDescriptionComponent } from './components/event/event-details/overview/location/location-description/location-description.component';
import { SliderPaymentDetailsComponent } from './components/event/event-details/requests/order-slider/slider-payment-details/slider-payment-details.component';
import { SliderOrderHistoryComponent } from './components/event/event-details/requests/order-slider/slider-order-history/slider-order-history.component';
import { SliderCustomerComponent } from './components/event/event-details/requests/order-slider/customer/customer.component';
import { CustomerComponent } from './components/event/event-details/orders/receipt/customer/customer.component';
import { ReceiptHeaderComponent } from './components/event/event-details/orders/receipt/receipt-header/receipt-header.component';
import { PaymentDetailsComponent } from './components/event/event-details/orders/receipt/payment-details/payment-details.component';
import { OrderBasicInfoComponent } from './components/event/event-details/orders/receipt/order-basic/order-basic.component';
import { ReceiptComponent } from './components/event/event-details/orders/receipt/receipt.component';
import { IncreaseQuantityComponent } from './components/event/event-details/tickets/increase-quantity/increase-quantity.component';
import { UpdateTicketTypeComponent } from './components/event/event-details/tickets/update-ticket-type/update-ticket-type.component';
import { AddComplementaryTicketComponent } from './components/event/event-details/tickets/add-complementary-ticket/add-complementary-ticket.component';
import { UpdateComplementaryComponent } from './components/event/event-details/tickets/update-complementary/update-complementary.component';
import { ComplementaryTicketCardComponent } from './components/event/event-details/tickets/complementart-ticket-card/complementart-ticket-card.component';
import {
  AddQuestionComponent
} from './components/event/event-details/questions/add-question-card/add-question-card.component';
import { QuestionComponent } from './components/event/event-details/questions/question/question.component';
import {
  AddTicketTypeComponent
} from './components/event/event-details/tickets/add-ticket-type/add-ticket-type.component';
import { TicketCardComponent } from './components/event/event-details/tickets/ticket-card/ticket-card.component';
import {
  TicketsFilterComponent
} from './components/event/event-details/tickets/tickets-filter/tickets-filter.component';
import { EventActivitiesComponent } from './components/event/event-details/activities/activities.component';
import { EventFeedBackComponent } from './components/event/event-details/feedback/feedback.component';
import { EventRequestsComponent } from './components/event/event-details/requests/requests.component';
import { EventQuestionsComponent } from './components/event/event-details/questions/questions.component';
import {
  UpdateEventBasicInfoComponent
} from './components/event/event-details/update-basic-info/update-basic-info.component';
import { EventAttachmentsComponent } from './components/event/event-details/overview/attachments/attachments.component';
import { EventLocationComponent } from './components/event/event-details/overview/location/location.component';
import {
  EventPerformancesComponent
} from './components/event/event-details/overview/performances/performances.component';
import { EventDescriptionComponent } from './components/event/event-details/overview/description/description.component';
import { EventOverviewComponent } from './components/event/event-details/overview/overview.component';
import {
  EventCommitteeMembersComponent
} from './components/event/event-details/committee-members/committee-members.component';
import { EventTicketsComponent } from './components/event/event-details/tickets/tickets.component';
import {
  EventTermsAndConditionsComponent
} from './components/event/event-details/terms-and-conditions/terms-and-conditions.component';
import { EventOrdersComponent } from './components/event/event-details/orders/orders.component';
import { EventBasicInfoComponent } from './components/event/event-details/basic-info/basic-info.component';
import { EventDetailsComponent } from './components/event/event-details/event-details.component';
import { EventsRoutingModule } from "app/+events/events-routing.module";

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAccordionModule,
  NgbActiveModal,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbProgressbarModule,
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
import { ReactiveValidationModule } from "angular-reactive-validation";
import { AddEventComponent } from "app/+events/components/event/add-event/add-event.component";
import { EventsComponent } from "app/+events/components/event/events/events.component";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { defineLordIconElement } from "lord-icon-element";
import lottie from "lottie-web";
// Google Maps
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { EventsCardComponent } from './components/event/events/events-card/events-card.component';
import { EventFiltersComponent } from './components/event/events/event-filters/event-filters.component';
import { EventBadgeDirectivesModule } from "./directives/Badges/event-badge-directives.module";
import { NgxPermissionsModule } from 'ngx-permissions';
import {
  CommitteeMembersFiltersComponent
} from './components/event/event-details/committee-members/committee-members-filters/committee-members-filters.component';
import {
  AssignCommitteeMembersComponent
} from './components/event/event-details/committee-members/assign-committee-members/assign-committee-members.component';
import { UnassignMemberComponent } from './components/event/event-details/committee-members/unassign-member/unassign-member.component';
import { UploadAttachmentsComponent } from './components/event/event-details/overview/attachments/upload-attachments/upload-attachments.component';
import { PublishEventComponent } from './components/event/publish-event/publish-event.component';
import { CancelEventComponent } from './components/event/cancel-event/cancel-event.component';
import { InviteNewClientsComponent } from './components/event/event-details/tickets/invite-new-clients/invite-new-clients.component';
import { UpdateMaxCapacityComponent } from './components/event/event-details/tickets/update-event-max-capacity/update-event-max-capacity.component';
import { ActivityItemTitleComponent } from './components/event/event-details/activities/activity-item-title/activity-item-title.component';
import { ActivityItemContentComponent } from './components/event/event-details/activities/activity-item-content/activity-item-content.component';
import { DailyActivitiesComponent } from './components/event/event-details/activities/daily-activities/daily-activities.component';
import { WeeklyActivitiesComponent } from './components/event/event-details/activities/weekly-activities/weekly-activities.component';
import { MonthlyActivitiesComponent } from './components/event/event-details/activities/monthly-activities/monthly-activities.component';
import { UploadFilesModule } from "@libs/upload-files/upload-files.module";
import { FileViewerModule } from "@libs/file-viewer/file-viewer.module";
import { PreviewActivityChangesComponent } from './components/event/event-details/activities/preview-activity-changes/preview-activity-changes.component';
import { OrderItemsComponent } from './components/event/event-details/orders/receipt/order-items/order-items.component';
import { OrderSliderComponent } from './components/event/event-details/requests/order-slider/order-slider.component';
import { PrimengTableModule } from "@libs/primeng-table/primeng-table.module";
import { CreateMemberComponent } from './components/event/event-details/committee-members/create-member/create-member.component';
import { UnassignMembersComponent } from './components/event/event-details/committee-members/unassign-members/unassign-members.component';
import { MakeContactMemberComponent } from './components/event/event-details/committee-members/make-contact-member/make-contact-member.component';
import { PreviewSliderComponent } from './components/event/event-details/committee-members/preview-slider/preview-slider.component';
import { DetailsTabComponent } from './components/event/event-details/committee-members/preview-slider/details-tab/details-tab.component';
import { SliderHeaderComponent } from './components/event/event-details/committee-members/preview-slider/slider-header/slider-header.component';
import { AuditsTabComponent } from './components/event/event-details/committee-members/preview-slider/audits-tab/audits-tab.component';
import { AssignedEventsComponent } from './components/event/event-details/committee-members/preview-slider/assigned-events/assigned-events.component';
import { MemberAuditsComponent } from './components/event/event-details/committee-members/preview-slider/audits-tab/audits/audits.component';
import { MemberActivityItemTitleComponent } from './components/event/event-details/committee-members/preview-slider/audits-tab/audits/activity-item-title/activity-item-title.component';
import { MemberPreviewActivityChangesComponent } from './components/event/event-details/committee-members/preview-slider/audits-tab/audits/preview-activity-changes/preview-activity-changes.component';
import { MemberActivityItemContentComponent } from './components/event/event-details/committee-members/preview-slider/audits-tab/audits/activity-item-content/activity-item-content.component';
import { MemberEventFiltersComponent } from './components/event/event-details/committee-members/preview-slider/assigned-events/event-filters/event-filters.component';
import { MemberEventsCardComponent } from './components/event/event-details/committee-members/preview-slider/assigned-events/events-card/events-card.component';
import { RequestsFilterComponent } from './components/event/event-details/requests/requests-filter/requests-filter.component';
import { RejectRequestsComponent } from './components/event/event-details/requests/reject-request/reject-request.component';
import { ApproveRequestsComponent } from './components/event/event-details/requests/approve-requests/approve-requests.component';
import { OrderFilterComponent } from './components/event/event-details/orders/order-filter/order-filter.component';
import { RequestOrdersComponent } from './components/event/event-details/requests/order-slider/orders/orders.component';
import { RequestAuditsComponent } from './components/event/event-details/requests/order-slider/audits/audits.component';
import { RequestAuditHeaderComponent } from './components/event/event-details/requests/order-slider/audits/header/header.component';
import { RequestAuditsBodyComponent } from './components/event/event-details/requests/order-slider/audits/body/body.component';
import { OrderPreviewComponent } from './components/event/event-details/orders/order-preview/order-preview.component';
import { CustomerOrderComponent } from './components/event/event-details/orders/order-preview/customer/customer.component';
import { PaymentDetailsOrderPreviewComponent } from './components/event/event-details/orders/order-preview/payment-details/payment-details.component';
import { OrderItemsPreviewComponent } from './components/event/event-details/orders/order-preview/order-items/order-items.component';
import { StatisticsComponent } from './components/event/event-details/overview/statistics/statistics.component';
import { PostponeEnventComponent } from './components/event/event-details/basic-info/postpone-envent/postpone-envent.component';

@NgModule({
  declarations: [
    EventsComponent,
    AddEventComponent,
    EventsCardComponent,
    EventFiltersComponent,
    EventDetailsComponent,
    EventBasicInfoComponent,
    EventOrdersComponent,
    EventTermsAndConditionsComponent,
    EventTicketsComponent,
    EventCommitteeMembersComponent,
    EventOverviewComponent,
    EventDescriptionComponent,
    EventPerformancesComponent,
    EventLocationComponent,
    EventAttachmentsComponent,
    CommitteeMembersFiltersComponent,
    AssignCommitteeMembersComponent,
    UpdateEventBasicInfoComponent,
    EventQuestionsComponent,
    EventRequestsComponent,
    EventFeedBackComponent,
    EventActivitiesComponent,
    TicketsFilterComponent,
    TicketCardComponent,
    AddTicketTypeComponent,
    QuestionComponent,
    AddQuestionComponent,
    UnassignMemberComponent,
    UploadAttachmentsComponent,
    PublishEventComponent,
    CancelEventComponent,
    ComplementaryTicketCardComponent,
    UpdateComplementaryComponent,
    AddComplementaryTicketComponent,
    UpdateTicketTypeComponent,
    IncreaseQuantityComponent,
    InviteNewClientsComponent,
    UpdateMaxCapacityComponent,
    ActivityItemTitleComponent,
    ActivityItemContentComponent,
    DailyActivitiesComponent,
    WeeklyActivitiesComponent,
    MonthlyActivitiesComponent,
    PreviewActivityChangesComponent,
    ReceiptComponent,
    OrderBasicInfoComponent,
    CustomerComponent,
    PaymentDetailsComponent,
    OrderItemsComponent,
    ReceiptHeaderComponent,
    OrderSliderComponent,
    SliderCustomerComponent,
    SliderOrderHistoryComponent,
    SliderPaymentDetailsComponent,
    LocationDescriptionComponent,
    CreateMemberComponent,
    UnassignMembersComponent,
    MakeContactMemberComponent,
    PreviewSliderComponent,
    DetailsTabComponent,
    SliderHeaderComponent,
    AuditsTabComponent,
    AssignedEventsComponent,
    MemberAuditsComponent,
    MemberActivityItemTitleComponent,
    MemberPreviewActivityChangesComponent,
    MemberActivityItemContentComponent,
    MemberEventFiltersComponent,
    MemberEventsCardComponent,
    RequestsFilterComponent,
    RejectRequestsComponent,
    ApproveRequestsComponent,
    OrderFilterComponent,
    RequestOrdersComponent,
    RequestAuditsComponent,
    RequestAuditHeaderComponent,
    RequestAuditsBodyComponent,
    OrderPreviewComponent,
    CustomerOrderComponent,
    PaymentDetailsOrderPreviewComponent,
    OrderItemsPreviewComponent,
    StatisticsComponent,
    PostponeEnventComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengTableModule,
    NgbModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbToastModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbRatingModule,
    NgbTooltipModule,
    ReactiveValidationModule,
    NgxSliderModule,
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
    FeatherModule.pick(allIcons),
    NgbProgressbarModule,
    EventBadgeDirectivesModule,
    NgxPermissionsModule.forChild(),
    UploadFilesModule,
    FileViewerModule,
    // Google Maps
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE',
      libraries: ["places"]
    }),
  ],
  providers: [
    NgbActiveModal,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class EventsModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
