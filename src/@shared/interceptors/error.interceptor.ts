import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from "@shared/services";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "app/+auth/service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private _router: Router,
              private _notificationService: NotificationService,
              private _spinner: NgxSpinnerService,
              private _authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
        catchError((err: HttpErrorResponse) => {
          this._spinner.hide();
          this.checkHttpStatus(err);
          return throwError(err);
        })
    );
  }

  private checkHttpStatus(err: HttpErrorResponse): void {
    switch (err.status) {
      case 400:
        this._notificationService.error('Invalid Info', this.getErrorMessages(err));
        break;
      case 403:
        this._router.navigate(['/auth/unauthorized']);
        break;
      case 401:
      case 402:
        this._authService.logout();
        break;
      case 404:
        this._router.navigate(['/auth/not-found']);
        break;
      case 500:
        this._notificationService.error('Server Error', this.getErrorMessages(err));
        break;
      default:
        this._notificationService.error('Something went wrong', this.getErrorMessages(err));
        break;
    }
  }

  private getErrorMessages(err: HttpErrorResponse): string {

    console.log(err)
    let err1 = err?.error?.errors ? Object.entries(err?.error?.errors)
        .map(([k, v]) => `${(v as string[])?.join(', ')}`)
        .join('.\n') : null;

    let err2 = err?.error?.errors;

    let err3 = err?.error?.detail;

    let err4 = typeof err?.error == "string" ? err?.error : null;

    let err5 = `Seems like something went wrong. please contact your administrator`;

    return err1 || err2 || err3 || err4 || err5;
  }
}
