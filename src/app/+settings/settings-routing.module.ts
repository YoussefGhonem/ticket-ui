import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CountriesComponent } from "app/+settings/components/countries/countries.component";
import { EventTypesComponent } from "app/+settings/components/event-type/event-types/event-types.component";
import { SettingsComponent } from "app/+settings/components/settings/settings.component";
import { SettingsAuditsComponent } from './components/settings-audits/settings-audits.component';

const routes: Routes = [
  {
    path: "",
    component: SettingsComponent
  },
  {
    path: "audits",
    component: SettingsAuditsComponent
  },
  {
    path: "countries",
    component: CountriesComponent,
  },
  {
    path: 'event-types',
    component: EventTypesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
