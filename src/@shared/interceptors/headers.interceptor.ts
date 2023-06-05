import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor() {
  }

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiUrl = environment.config?.apiConfig?.apiUrl;
    const isApiUrl = request.url.startsWith(apiUrl);

    if (isApiUrl) {
      request = request.clone({
        setHeaders: {
          "Accept": 'application/json',
          // "Content-Type": 'application/json',
          // 'Content-Type': 'multipart/form-data'
        }
      });
    }

    return next.handle(request);
  }
}
