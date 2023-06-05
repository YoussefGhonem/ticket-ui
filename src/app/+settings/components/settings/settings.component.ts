import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsController } from "app/+settings/controllers";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})


export class SettingsComponent extends BaseComponent implements OnInit, OnChanges {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  verificationFileForm!: UntypedFormGroup;
  settings: any;

  constructor(
      public override injector: Injector,
      private _formBuilder: UntypedFormBuilder
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {

    this.breadCrumbItems = [
      {label: 'Home'},
      {label: 'Settings', active: true},
      {label: 'Settings', active: true}
    ];

    this.getSettings();
    this.initializeForm();

  }

  getSettings() {
    this.httpService.GET(SettingsController.Settings)
        .subscribe((settings) => {
          this.settings = settings;
          console.log(settings);
        })
  }

  initializeForm() {
    this.verificationFileForm = this._formBuilder.group({
      uploadedFile: ['', Validators.required]
    });
  }

  get form() {
    return this.verificationFileForm.controls;
  }


}
