import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommiteeMembersComponent } from './components/commitee-members/commitee-members.component';

const routes: Routes = [
  {
    path: "commitee-members",
    component: CommiteeMembersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule {
}
