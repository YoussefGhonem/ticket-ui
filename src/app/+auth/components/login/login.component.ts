import { RegisterValidator } from './../../validators/register.validator';
import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from "@shared/base/base.component";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "app/+auth/service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();

  constructor(public override injector: Injector,
              private _formBuilder: UntypedFormBuilder,
              private _route: ActivatedRoute,
              private _authService: AuthService) {
    super(injector);

  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: new FormControl('superadmin@gmail.com', RegisterValidator.userAccount.email),
      password: new FormControl('Admin@2010', RegisterValidator.userAccount.password),
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    let body = this.loginForm.getRawValue();
    this._authService.login(body.email, body.password);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
