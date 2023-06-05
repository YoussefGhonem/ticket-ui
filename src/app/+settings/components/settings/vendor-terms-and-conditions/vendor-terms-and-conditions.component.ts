import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, Output } from "@angular/core";
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SettingsController } from 'app/+settings/controllers';
import { SettingsValidator } from "app/+settings/validators/settings.validators";

@Component({
  selector: 'vendors-terms-and-conditions',
  templateUrl: './vendor-terms-and-conditions.component.html',
  styleUrls: ['./vendor-terms-and-conditions.component.scss']
})
export class VendorTermsAndConditionsComponent extends BaseComponent {
  vendorTermsSubmit: boolean = false;
  public VendorEditor = ClassicEditor;
  vendorTermsForm!: UntypedFormGroup;
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

  ngOnInit(): void {
    console.log(this.settings);
    this.initializeForm();
  }

  initializeForm() {
    this.vendorTermsForm = this._formBuilder.group({
      vendorTermsAndConditions: new FormControl(this.settings?.vendorTermsAndConditions, SettingsValidator.termsAndConditions)
    });

    this.vendorTermsForm?.controls['vendorTermsAndConditions'].patchValue(this.settings?.vendorTermsAndConditions);
  }

  get() {
    return this.vendorTermsForm.controls;
  }

  onVendorSubmit() {
    this.vendorTermsSubmit = true;
    if (this.vendorTermsForm.invalid) {
      return;
    }
    let body = this.vendorTermsForm.getRawValue();
    console.log(SettingsController.UpdateVendorTermsAndConditions);
    console.log(body);
    this.httpService.PATCH(SettingsController.UpdateVendorTermsAndConditions, body, undefined)
      .subscribe(() => {
        this.notificationService.success("Changes are saved", 'Terms & Conditions is updated successfully! 🎉');
        this.loadSettings.emit();
      });
  }
}
