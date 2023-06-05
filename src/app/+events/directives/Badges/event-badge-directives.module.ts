import { NgModule } from '@angular/core';
import { EventStatusBadgeDirective } from './event-status-badge.directive';

@NgModule({
  declarations: [
    EventStatusBadgeDirective,
  ],
  exports: [
    EventStatusBadgeDirective,
  ]
})
export class EventBadgeDirectivesModule {
}
