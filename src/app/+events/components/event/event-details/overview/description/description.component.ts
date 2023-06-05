import { ActivatedRoute } from '@angular/router';
import { EventsController } from 'app/+events/controllers';
import { EventValidator } from './../../../../../validators/event.validators';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from "@angular/core";
import { BaseComponent } from "@shared/base/base.component";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { EventAllowedActions } from 'app/+events/models';

@Component({
  selector: "app-event-description",
  templateUrl: "./description.component.html",
  styleUrls: ["./description.component.scss"],
})
export class EventDescriptionComponent extends BaseComponent implements OnInit {
  editMode: boolean = false;
  @Input() description: string;
  @Input() eventAllowedAction: EventAllowedActions[];
  allowedActions = EventAllowedActions;
  @Output() getNewDescription = new EventEmitter();

  eventId: string;
  updateDescriptionForm!: FormGroup;

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

  constructor(public override injector: Injector,
    private _router: ActivatedRoute,
    private _builder: UntypedFormBuilder) {
    super(injector);

  }

  ngOnInit(): void {
    this.initializeForm();
    this.getEventIdFromQuery();
  }

  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  getEventIdFromQuery() {
    this._router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
      });
  }

  initializeForm() {
    this.updateDescriptionForm = this._builder.group({
      description: new FormControl(null, EventValidator.description)
    });
  }

  onEditClick() {
    this.updateDescriptionForm?.controls['description'].patchValue(this.description);
    this.editMode = true;
  }

  onCancelClick() {
    this.editMode = false;
    this.updateDescriptionForm.markAsPristine();
  }

  onSaveClick() {
    if (this.updateDescriptionForm.invalid) {
      return;
    }

    let body = this.updateDescriptionForm.getRawValue();
    this.httpService.PATCH(EventsController.UpdateDescription(this.eventId), body)
      .subscribe(res => {
        this.notificationService.success("Changes are saved", "Description updated successfully!");
        this.editMode = false;
        this.getNewDescription.emit();
      });
  }
}
