import { AuthService } from 'app/+auth/service';
import { UsersValidator } from 'app/+users/validators/user.validator';
import { IdentityController } from 'app/+users/controllers/IdentityController';
import { BaseComponent } from '@shared/base/base.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, Injector, OnInit } from '@angular/core';
import { confirmPasswordValidator } from '@shared/custom-validators/confirm-password.validator';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})


export class ChangePasswordComponent extends BaseComponent implements OnInit {

  updatePasswordSubmit: boolean = false;
  updatePasswordForm!: UntypedFormGroup;
  oldFieldTextType: boolean = false;
  newFieldTextType: boolean = false;
  confirmFieldTextType: boolean = false;


  constructor
  (
      public override injector: Injector,
      private _authService: AuthService,
      private _formBuilder: UntypedFormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this.updatePasswordForm = this._formBuilder.group({
      oldPassword: ['', UsersValidator.password],
      newPassword: ['', UsersValidator.password],
      confirmPassword: ['', UsersValidator.confirmPassword]
    });

  }

  showValidationPasswordOption() {
    let input = document.getElementById("password-contain") as HTMLElement;
    input.style.display = "block"
  }

  isConfirmEqual() {
    if (this.updatePasswordForm.get('confirmPassword').value !== this.updatePasswordForm.get('newPassword').value) {
      return true;
    }
    return false;
  }

  onPasswordSubmit() {
    this.updatePasswordSubmit = true;
    if (this.updatePasswordForm.invalid) {
      return;
    }
    let body = this.updatePasswordForm.getRawValue();
    this.httpService.PUT(IdentityController.ChangePassword, body)
        .subscribe(() => {
          this._authService.logout();
        })
  }

  toggleOldFieldTextType() {
    this.oldFieldTextType = !this.oldFieldTextType;
  }

  toggleNewFieldTextType() {
    this.newFieldTextType = !this.newFieldTextType;
  }

  toggleConfirmFieldTextType() {
    this.confirmFieldTextType = !this.confirmFieldTextType;
  }
}

