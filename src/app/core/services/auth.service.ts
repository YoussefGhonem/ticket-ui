import { Injectable } from '@angular/core';
import { User } from '../models/auth.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalComponent } from "../../global-component";

const AUTH_API = GlobalComponent.AUTH_API;

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({providedIn: 'root'})

/**
 * Auth-service Component
 */
export class AuthenticationService {

  user!: User;
  currentUserValue: any;

  private currentUserSubject: BehaviorSubject<User>;

  // public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    // this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(email: string, first_name: string, password: string) {
    // return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
    //     const user = response;
    //     return user;
    // });

    // Register Api
    return this.http.post(AUTH_API + 'signup', {
      email,
      first_name,
      password,
    }, httpOptions);
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {
    // return getFirebaseBackend()!.loginUser(email, password).then((response: any) => {
    //     const user = response;
    //     return user;
    // });

    return this.http.post(AUTH_API + 'signin', {
      email,
      password
    }, httpOptions);
  }

  public currentUser(): any {
    return null;
  }

  logout() {
    // logout the user
    // return getFirebaseBackend()!.logout();

    localStorage.removeItem('TicketManagement-User');
    localStorage.removeItem('TicketManagement-AuthToken');
    this.currentUserSubject.next(null!);
  }

  resetPassword(email: string) {
    return '';
  }

}

