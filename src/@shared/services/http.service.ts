import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { IQueryParamater } from "../interfaces/IQueryParamater";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "environments/environment";
import { NotificationService } from "./notification.service";
import { Observable } from "rxjs";
import { LocalStorageKeys } from "@shared/default-values";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(
    private notificationService: NotificationService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  get token(): string | null {
    return localStorage.getItem(LocalStorageKeys.AuthToken) || null;
  }

  // GET request
  GET(
    url: string,
    queryParameters?: object,
    showSpinner: boolean = true
  ): Observable<any> {
    if (showSpinner) this.spinner.show();

    const httpParams: HttpParams = this.parameterizedUrl(queryParameters);
    return this.http
      .get<any>(this.getFullUrl(url), {
        observe: "response",
        params: httpParams,
      })
      .pipe(
        map((res) => res.body),
        tap((res) => this.spinner.hide())
      );
  }

  // PUT request
  PUT(url: string, body: any = {}, queryParameters?: object): Observable<any> {
    this.spinner.show();

    const httpParams: HttpParams = this.parameterizedUrl(queryParameters);

    return this.http
      .put(this.getFullUrl(url), body, {
        observe: "response",
        params: httpParams,
      })
      .pipe(
        map((res) => res.body),
        tap((res) => this.spinner.hide())
      );
  }

  // PATCH request
  PATCH(
    url: string,
    body: any = {},
    queryParameters?: object
  ): Observable<any> {
    this.spinner.show();

    const httpParams: HttpParams = this.parameterizedUrl(queryParameters);

    return this.http
      .patch(this.getFullUrl(url), body, {
        observe: "response",
        params: httpParams,
      })
      .pipe(
        map((res) => res.body),
        tap((res) => this.spinner.hide())
      );
  }

  // DELETE request
  DELETE(url: string, queryParameters?: object): Observable<any> {
    this.spinner.show();
    const httpParams: HttpParams = this.parameterizedUrl(queryParameters);
    return this.http
      .delete(this.getFullUrl(url), {
        observe: "response",
        params: httpParams,
        body: {},
      })
      .pipe(
        map((res) => res.body),
        tap((res) => this.spinner.hide())
      );
  }
  // POST request
  POST(url: string, body: any = {}, queryParameters?: object): Observable<any> {
    this.spinner.show();
    const httpParams: HttpParams = this.parameterizedUrl(queryParameters);
    return this.http
      .post(this.getFullUrl(url), body, {
        observe: "response",
        params: httpParams,
      })
      .pipe(
        map((res) => res.body),
        tap((res) => this.spinner.hide())
      );
  }
  // POST request
  ExportExcel(
    url: string,
    body: any,
    queryParameters?: object
  ): Observable<any> {
    this.spinner.show();
    const httpParams: HttpParams = this.parameterizedUrl(queryParameters);

    return this.http
      .post(this.getFullUrl(url), body, {
        observe: "response",
        params: httpParams,
        responseType: "blob",
      })
      .pipe(
        map((res) => res.body),
        tap((res) => this.spinner.hide())
      );
  }

  ExportToExcel(
    url: string,
    queryParameters?: object,
    columns: any[] = null
  ): Observable<any> {
    this.spinner.show();
    const httpParams: HttpParams = this.parameterizedUrl(queryParameters);

    return this.http
      .post(
        this.getFullUrl(url),
        {},
        {
          observe: "response",
          params: httpParams,
          responseType: "blob",
        }
      )
      .pipe(
        map((res) => res.body),
        tap((res) => this.spinner.hide())
      );
  }

  Download(url: string): Observable<any> {
    this.spinner.show();

    return this.http
      .get(url, {
        observe: "response",
        responseType: "blob",
      })
      .pipe(
        map((res) => res.body),
        tap((res) => this.spinner.hide())
      );
  }

  //#region Helper Methods

  getFullUrl(uri: string): string {
    return `${environment.config?.apiConfig?.apiUrl}/api/v${environment.config?.apiConfig?.apiVersion}/${uri}`;
  }

  objectToFormData(obj: any, rootName?: any, ignoreList?: any) {
    let formData = new FormData();

    function appendFormData(data: any, root: any) {
      if (!ignore(root)) {
        root = root || "";
        if (data instanceof File) {
          formData.append(root, data);
        } else if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            appendFormData(data[i], root);
          }
        } else if (typeof data === "object" && data) {
          for (let key in data) {
            if (data.hasOwnProperty(key)) {
              if (root === "") {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + "." + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== "undefined") {
            formData.append(root, data);
          }
        }
      }
    }

    function ignore(root: any) {
      return (
        Array.isArray(ignoreList) &&
        ignoreList.some(function (x) {
          return x === root;
        })
      );
    }

    appendFormData(obj, rootName);

    return formData;
  }

  jsonToFormData(data: any) {
    const formData = new FormData();

    this.buildFormData(formData, data);

    return formData;
  }

  private parameterizedUrl(queryParameters?: object): HttpParams {
    if (!queryParameters) return new HttpParams();

    let httpParams: HttpParams = new HttpParams();

    let keyValues: IQueryParamater[] = Object.keys(queryParameters)
      .map((key) => {
        return {
          key: key,
          value: queryParameters[key as keyof object],
        };
      })
      .filter((x) => x.value != null);

    keyValues.forEach((keyValue) => {
      if (Array.isArray(keyValue.value)) {
        // In-case you pass array

        // ...?Frequencies=1&Frequencies=2&Frequencies=3
        keyValue.value.forEach(
          (x) => (httpParams = httpParams.append(keyValue.key, x))
        );
      } else if (
        Object.prototype.toString.call(keyValue.value) === "[object Date]"
      ) {
        httpParams = httpParams.append(
          keyValue.key,
          new Date(keyValue.value).toISOString()
        );
      } else if (typeof keyValue.value === "object") {
        Object.keys(keyValue.value).forEach(
          (x) => (httpParams = httpParams.append(x, keyValue.value[x]))
        );
      } else {
        httpParams = httpParams.append(keyValue.key, keyValue.value);
      }
    });

    return httpParams;
  }

  private buildFormData(formData: any, data: any, parentKey?: any) {
    if (
      data &&
      typeof data === "object" &&
      !(data instanceof Date) &&
      !(data instanceof File)
    ) {
      Object.keys(data).forEach((key) => {
        this.buildFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}[${key}]` : key
        );
      });
    } else {
      const value = data == null ? "" : data;

      formData.append(parentKey, value);
    }
  }

  //#endregion
}
