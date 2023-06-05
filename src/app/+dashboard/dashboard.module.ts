import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// Component dashboard
import { defineLordIconElement } from 'lord-icon-element';

import { CommonModule } from "@angular/common";
import { WidgetModule } from "app/shared/widget/widget.module";
import { SharedModule } from "app/shared/shared.module";
import { FlatpickrModule } from "angularx-flatpickr";
import { SwiperModule } from "swiper/angular";
import { NgApexchartsModule } from "ng-apexcharts";
import { SimplebarAngularModule } from "simplebar-angular";
import {
  NgbActiveModal,
  NgbDropdownModule,
  NgbNavModule,
  NgbProgressbarModule,
  NgbToastModule
} from "@ng-bootstrap/ng-bootstrap";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { CountToModule } from "angular-count-to";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { DashboardRoutingModule } from "app/+dashboard/dashboard-routing.module";
import { SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import lottie from 'lottie-web';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfitsStatisticsComponent } from './components/vendor-admin/profits-statistics/profits-statistics.component';
import { UserStatisticsComponent } from './components/vendor-admin/user-statistics/user-statistics.component';
import { TicketsStatisticsComponent } from './components/vendor-admin/tickets-statistics/tickets-statistics.component';
import { RequestsStatisticsComponent } from './components/vendor-admin/requests-statistics/requests-statistics.component';
import { EventStatisticsComponent } from './components/vendor-admin/event-statistics/event-statistics.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { VendorAdminDashboardComponent } from './components/vendor-admin/vendor-admin-dashboard.component';
import { SharedPipesModule } from '@shared/pipes/pipes.module';
import { VendorCardsStatisticsComponent } from './components/admin-dashboard/vendor-cards-statistics/vendor-cards-statistics.component';
import { EventCardStatisticsComponent } from './components/admin-dashboard/event-card-statistics/event-card-statistics.component';
import { RequestCardStatisticsComponent } from './components/admin-dashboard/request-card-statistics/request-card-statistics.component';
import { VendorProfitStatisticsComponent } from './components/admin-dashboard/vendor-profit-statistics/vendor-profit-statistics.component';
import { AdminProfitStatisticsComponent } from './components/admin-dashboard/admin-profit-statistics/admin-profit-statistics.component';
import { MembersStatisticsComponent } from './components/vendor-admin/members-statistics/members-statistics.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    UserStatisticsComponent,
    ProfitsStatisticsComponent,
    TicketsStatisticsComponent,
    RequestsStatisticsComponent,
    EventStatisticsComponent,
    VendorAdminDashboardComponent,
    AdminDashboardComponent,
    VendorCardsStatisticsComponent,
    EventCardStatisticsComponent,
    RequestCardStatisticsComponent,
    VendorProfitStatisticsComponent,
    AdminProfitStatisticsComponent,
    MembersStatisticsComponent
  ],
  imports: [
    CommonModule,
    NgbToastModule,
    FeatherModule.pick(allIcons),
    CountToModule,
    LeafletModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgApexchartsModule,
    SwiperModule,
    FlatpickrModule.forRoot(),
    SharedModule,
    WidgetModule,
    NgbProgressbarModule,
    LightboxModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedPipesModule
  ],
  providers: [
    NgbActiveModal,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
