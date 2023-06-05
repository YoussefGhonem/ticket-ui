import { ReceiptComponent } from './components/event/event-details/orders/receipt/receipt.component';
import { EventDetailsComponent } from './components/event/event-details/event-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { EventsComponent } from "app/+events/components/event/events/events.component";
import { AddEventComponent } from "app/+events/components/event/add-event/add-event.component";

const routes: Routes = [
  {
    path: "",
    component: EventsComponent
  },
  {
    path: "add",
    component: AddEventComponent
  },
  {
    path: ":id",
    component: EventDetailsComponent
  },
  {
    path: ":id/orders/1",
    component: ReceiptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {
}
