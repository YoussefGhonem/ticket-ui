import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { NgxPermissionsService } from "ngx-permissions";
import { UserModel } from "app/+auth/models";
import jwt_decode from "jwt-decode";
import { HttpService, NotificationService } from "@shared/services";
import { LocalStorageKeys } from "@shared/default-values";
import { IdentityController } from "app/+users/controllers";
import { environment } from "environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser$: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);

  constructor(
    private _router: Router,
    private _permissionsService: NgxPermissionsService,
    private _httpService: HttpService,
    private _notificationService: NotificationService,
  ) {
    this.currentUser$?.next(this.currentUser);
  }

  get currentUser(): UserModel {
    return JSON.parse(localStorage.getItem(LocalStorageKeys.User)!);
  }

  get token(): string | null {
    return localStorage.getItem(LocalStorageKeys.AuthToken) || null;
  }

  logout(): void {
    localStorage.removeItem(LocalStorageKeys.User);
    localStorage.removeItem(LocalStorageKeys.AuthToken);

    this.currentUser$.next(null);
    this._router.navigate(['/auth/login']);
  }

  login(email: string, password: string) {
    const body = {
      email: email,
      password: password
    };

    return this._httpService.POST(IdentityController.Login, body)
      .subscribe((res: string) => {
        this.updateToken(res);
        console.log("this.currentUser?.roles", this.currentUser?.roles);

        if (this.currentUser?.roles.includes('SuperAdmin')) {
          this._router.navigate(['/dashboard/admin']);
        }
        else if (this.currentUser?.roles.includes('CommitteeMember')) {
          this._router.navigate(['/events']);
        }
        else {
          this._router.navigate(['/dashboard/vendor']);
        }
      });
  }

  updateToken(token: string): void {
    let user = this.decodeToken(token);
    this.currentUser$.next(user);
    localStorage.setItem(LocalStorageKeys.AuthToken, token);
    localStorage.setItem(LocalStorageKeys.User, JSON.stringify(user));
    this.loadPermissions();
  }

  loadPermissions(): void {
    let roles = this.currentUser?.roles?.map(x => x?.toString()) || [];
    this._permissionsService.loadPermissions(roles);
  }

  UpdateUserInfo(firstName: string, lastName: string, phoneNumber?: string, imageUrl?: string): void {
    let currentUser = this.currentUser;

    currentUser.name = `${firstName} ${lastName}`;
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.phoneNumber = phoneNumber;
    currentUser.imageUrl = imageUrl;

    this.currentUser$.next(currentUser);
    localStorage.setItem(LocalStorageKeys.User, JSON.stringify(currentUser));
  }

  private decodeToken(token: string): UserModel {
    let decoded = jwt_decode(token) as any;
    return {
      id: decoded?.Id,
      firstName: decoded?.FirstName,
      lastName: decoded?.LastName,
      name: `${decoded?.FirstName} ${decoded?.LastName}`,
      imageUrl: this.imageUrl(decoded),
      email: decoded?.Email,
      status: decoded?.Status,
      phoneNumber: decoded?.PhoneNumber,
      vendorId: decoded?.VendorId,
      roles: typeof decoded?.role == "string" ? [decoded?.role] : decoded?.role
    }
  }

  private imageUrl(decoded: any): string | null {
    if (!decoded?.Image_Id) return null;
    return `${environment.config?.apiConfig?.apiUrl}/api/v1/files/${decoded?.Image_Id}/download`;
  }

}
