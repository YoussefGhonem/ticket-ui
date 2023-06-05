import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SettingsController } from 'app/+settings/controllers';
import { SettingsValidator } from "app/+settings/validators/settings.validators";

@Component({
  selector: 'app-user-terms-and-conditions',
  templateUrl: './user-terms-and-conditions.component.html',
  styleUrls: ['./user-terms-and-conditions.component.scss']
})


export class UserTermsAndConditionsComponent extends BaseComponent implements OnInit, OnChanges {
  userTermsSubmit: boolean = false;
  public UserEditor = ClassicEditor;
  userTermsForm!: UntypedFormGroup;
  editorConfig = {
    removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed', 'Link'],
    mediaEmbed: {},
    removeButtons: ['Image']
  };
  @Input() settings: any = null;
  @Output() loadSettings = new EventEmitter();

  constructor(
      public override injector: Injector,
      private _formBuilder: UntypedFormBuilder
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.userTermsForm = this._formBuilder.group({
      publicTermsAndConditions: new FormControl(this.settings?.publicTermsAndConditions, SettingsValidator.termsAndConditions)
    });

    this.userTermsForm?.controls['publicTermsAndConditions'].patchValue(this.settings?.publicTermsAndConditions);
  }

  get form() {
    return this.userTermsForm.controls;
  }

  onUserSubmit() {
    this.userTermsSubmit = true;
    if (this.userTermsForm.invalid) {
      return;
    }
    let body = this.userTermsForm.getRawValue();
    this.httpService.PATCH(SettingsController.UserTermsAndConditions, body, undefined)
        .subscribe(() => {
          this.notificationService.success("Changes are saved", 'Terms & Conditions is updated successfully! 🎉');
          this.loadSettings.emit();
        });
  }
}
