import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, } from '@angular/router';
import { AuthService } from "app/+auth/service/auth.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this._authService.currentUser) {
      await this._router.navigate(['/auth/login']);
      return false;
    }

    // if (route.data.roles && route.data.roles.indexOf(user?.profile?.role) === -1) {
    //   await this.router.navigate(['/pages/miscellaneous/not-authorized']);
    //   return false;
    // }

    return true;
  }

}
