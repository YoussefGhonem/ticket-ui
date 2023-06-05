import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from "environments/environment";

@Pipe({
  name: 'secure'
})
export class SecureFilePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  transform(url: string): Observable<SafeUrl> {

    if (!url) return of(url);

    const apiUrl = environment.config?.apiConfig?.apiUrl || '';
    const isApiUrl = url?.startsWith(apiUrl);

    if (!isApiUrl) return of(url);
    const httpOptions = {
      headers: new HttpHeaders()
    }
    let headers = httpOptions.headers.append('Access-Control-Allow-Origin', '*');

    return this.http
        .get(url, {responseType: 'blob', headers: headers})
        .pipe(
            map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)))
        );
  }

}


/******
 * If yor image is secured, and you want to send the http get with the token via http interceptor
 * <img (error)="resourceImage($event)" [src]="resourceImage() | secure | async" alt="alt" height="170"/>
 * */
