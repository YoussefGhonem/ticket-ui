import { RegisterValidator } from "./../../validators/register.validator";
import { Component, Injector, OnInit, AfterViewInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "app/+auth/service";
import { BaseComponent } from "@shared/base/base.component";
import { confirmPasswordValidator } from "@shared/custom-validators/confirm-password.validator";
import { IdentityController } from "app/+users/controllers";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomPdfViewerComponent } from "@libs/custom-pdf-viewer/custom-pdf-viewer.component";
import { ngbModalOptions } from "@shared/default-values";
import { SettingsController } from "app/+settings/controllers";
import { FileViewerAndSignatureComponent } from "../file-viewer-and-signature/file-viewer-and-signature.component";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent extends BaseComponent implements OnInit, AfterViewInit {
  // Login Form
  passresetForm!: UntypedFormGroup;
  submitted = false;
  passwordField!: boolean;
  confirmField!: boolean;
  error = "";
  returnUrl!: string;
  displaySuccess: boolean;
  displayForm: boolean = true;
  displayError: boolean;

  verificationDocument: any;
  initializeSignaturePad: boolean = false;
  // set the current year
  year: number = new Date().getFullYear();

  params: { email: string; token: string; displaySignature: boolean };

  constructor(
    public override injector: Injector,
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
  ) {
    super(injector);

    this._activatedRoute.queryParams.subscribe((params) => {
      this.params = {
        email: params["email"],
        token: params["token"],
        displaySignature: Boolean(params["verify"]),
      };

      // Checking Email and Token exists
      if (!this.params.email || !this.params.token) {
        this.displayError = true;
        this.displayForm = false;
      }
    });

  }
  ngAfterViewInit(): void {
    if(this.params.displaySignature) {
      this.passresetForm.get('signature').setValidators(RegisterValidator.userAccount.signature);
      this.passresetForm.get('signature').updateValueAndValidity();
      this.passresetForm.get('agreeTermsAndConditions').setValidators(RegisterValidator.userAccount.agreeTermsAndConditions);
      this.passresetForm.get('agreeTermsAndConditions').updateValueAndValidity();
    } else {
      this.passresetForm.get('signature').patchValue(null);
      this.passresetForm.get('signature').clearValidators();
      this.passresetForm.get('signature').updateValueAndValidity();
      this.passresetForm.get('agreeTermsAndConditions').patchValue(false);
      this.passresetForm.get('agreeTermsAndConditions').clearValidators();
      this.passresetForm.get('agreeTermsAndConditions').updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.getVerificationDocument();

    this.initForm();
  }

  private initForm(): void {

    this.passresetForm = this._formBuilder.group(
      {
        password: new FormControl(null, RegisterValidator.userAccount.password),
        confirmPassword: new FormControl(
          null,
          RegisterValidator.userAccount.confirmPassword('password')
        ),
        signature: new FormControl(null),
        agreeTermsAndConditions: new FormControl(false)
      }
    );


  }

  showValidationPasswordOption() {
    let input = document.getElementById("password-contain") as HTMLElement;
    input.style.display = "block";
  }

  f(){
    return this.passresetForm.controls;
  }
  /**
   * Form submit
   */
  onSubmit(): any {
    this.submitted = true;
    // stop here if form is invalid
    if (this.passresetForm.invalid) return;

    let formBody = this.passresetForm.getRawValue();
    let body = {
      Token: this.params.token,
      NewPassword: formBody.password,
      ConfirmPassword: formBody.confirmPassword,
      signature: formBody.signature,
    };
    return this.httpService
      .POST(IdentityController.ResetPassword(this.params.email), body)
      .subscribe(() => {
        this.displayForm = false;
        this.displaySuccess = true;
      });
  }

  isConfirmEqual() {
    if (
      this.passresetForm.get("confirmPassword").value !==
      this.passresetForm.get("password").value
    ) {
      return true;
    }
    return false;
  }

  /**
   * Password Hide/Show
   */
  togglepasswordField() {
    this.passwordField = !this.passwordField;
  }

  /**
   * Password Hide/Show
   */
  toggleconfirmField() {
    this.confirmField = !this.confirmField;
  }

  getVerificationDocument() {
    this.httpService
      .GET(SettingsController.GetVerificationDocument)
      .subscribe((verificationDocument) => {
        this.verificationDocument = verificationDocument;
      });
  }

  openPreviewAndSign() {
    const modalRef = this.modalService.open(FileViewerAndSignatureComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success',
      size: 'lg'
    });
    modalRef.componentInstance.title = this.verificationDocument?.verificationDocumentName?.split('.')?.slice(0, -1)?.join('.');
    modalRef.componentInstance.src = this.verificationDocument?.verificationDocumentUrl;
    modalRef.componentInstance.signupForm = this.passresetForm;
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true))
      .catch(() => {
      });
  }
}
