import { SettingsValidator } from 'app/+settings/validators';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SettingsController } from 'app/+settings/controllers';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'configuration-update',
  templateUrl: './configuration-update.component.html',
  styleUrls: ['./configuration-update.component.scss']
})
export class ConfigurationUpdateComponent extends BaseComponent implements OnInit, OnChanges {
  updateFeesSubmit: boolean = false;
  ticketFeesForm!: UntypedFormGroup;
  @Input() settings: any = null;
  @Output() loadSettings = new EventEmitter();

  constructor(public override injector: Injector, private _formBuilder: UntypedFormBuilder) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.patchFees();
  }

  ngOnInit() {
    this.initializeForm();
    this.patchFees();
  }

  initializeForm() {
    this.ticketFeesForm = this._formBuilder.group({
      ticketFees: new FormControl(null, SettingsValidator.fees)
    });
  }

  patchFees() {
    this.ticketFeesForm?.controls['ticketFees'].patchValue(this.settings?.ticketFeesPercentage);
  }

  form() {
    return this.ticketFeesForm.controls;
  }

  onSubmit() {
    this.updateFeesSubmit = true;
    if (this.ticketFeesForm.invalid) {
      return;
    }

    let body = this.ticketFeesForm.getRawValue();

    this.httpService.PUT(SettingsController.EventFees, body, undefined)
      .subscribe(() => {
        this.notificationService.success("Changes are saved", 'Fees are updated successfully! 🎉');
        this.loadSettings.emit();
      });
  }
}
