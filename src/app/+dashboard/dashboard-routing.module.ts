import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { VendorAdminDashboardComponent } from './components/vendor-admin/vendor-admin-dashboard.component';

const routes: Routes = [
  {
    path: "vendor",
    component: VendorAdminDashboardComponent
  },
  {
    path: "admin",
    component: AdminDashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
