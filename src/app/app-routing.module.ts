import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { AuthGuard } from "app/+auth/helpers";


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./+auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () => import('./+dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () => import('./+users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () => import('./+settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'events',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () => import('./+events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'vendors',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () => import('./+vendors/vendors.module').then(m => m.VendorsModule)
  },
  {
    path: '',
    redirectTo: '/events',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/events' //Error 404 - Page not found
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
