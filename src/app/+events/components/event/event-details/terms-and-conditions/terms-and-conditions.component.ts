import { EventValidator } from './../../../../validators/event.validators';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { EventsController } from 'app/+events/controllers';
import { EventAllowedActions } from 'app/+events/models';

@Component({
  selector: 'app-event-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class EventTermsAndConditionsComponent extends BaseComponent implements OnInit {
  @Input() eventAllowedAction: EventAllowedActions[];
  @Output('loadActivities') loadActivities = new EventEmitter();
  @Output('loadEvent') loadEvent = new EventEmitter();

  allowedActions = EventAllowedActions;

  updateTermsAndConditionsForm!: UntypedFormGroup;
  termsAndConditions: string;
  eventId: string;

  editorConfig = {
    removePlugins: [
      "CKFinderUploadAdapter",
      "CKFinder",
      "EasyImage",
      "Image",
      "ImageCaption",
      "ImageStyle",
      "ImageToolbar",
      "ImageUpload",
    ],
    removeButtons: ["Image"],
  };

  public Editor = ClassicEditor;
  editMode: boolean = false;

  constructor(
    public override injector: Injector,
    private _builder: UntypedFormBuilder,
    private router: ActivatedRoute
  ) {
    super(injector);
  }

  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
    this.loadtEventermsAndConditions();
    this.initializeForm();
  }

  initializeForm() {
    this.updateTermsAndConditionsForm = this._builder.group({
      termsAndConditions: new FormControl(this.termsAndConditions, EventValidator.termsAndConditions)
    });
  }

  loadActivitiesEvent() {
    this.loadActivities.emit();
  }

  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        this.eventId = params.get('id');
      });
  }

  loadtEventermsAndConditions() {
    this.httpService.GET(EventsController.GetTermsAndConditions(this.eventId))
      .subscribe(termsAndConditions => {
        console.log(termsAndConditions);
        this.termsAndConditions = termsAndConditions;
      });
  }


  onEditClick() {
    this.updateTermsAndConditionsForm?.get('termsAndConditions').patchValue(this.termsAndConditions);
    this.editMode = true;
  }

  onCancelClick() {
    this.editMode = false;
  }

  onSaveClick() {
    if (this.updateTermsAndConditionsForm.invalid) {
      return;
    }
    let body = this.updateTermsAndConditionsForm.getRawValue();

    this.httpService.PATCH(EventsController.UpdateTermsAndConditions(this.eventId), body)
      .subscribe(res => {
        this.notificationService.success("Changes are saved", "Terms and Conditions updated successfully");
        this.editMode = false;
        this.loadtEventermsAndConditions();
        this.loadActivitiesEvent();
        this.loadEvent.emit();
      });
  }

}
