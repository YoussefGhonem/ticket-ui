import { ActivatedRoute } from '@angular/router';
import { EventsController } from 'app/+events/controllers';
import { EventValidator } from './../../../../validators/event.validators';
import { Event } from 'app/+events/models/event.model';
import { FormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { EventTypesController } from 'app/+settings/controllers';
import { filesService } from '@shared/services';


@Component({
  selector: 'app-update-basic-info',
  templateUrl: './update-basic-info.component.html',
  styleUrls: ['./update-basic-info.component.scss']
})
export class UpdateEventBasicInfoComponent extends BaseComponent implements OnInit {

  form!: UntypedFormGroup;
  eventTypes: any[];
  image: File;
  days: number[] = [];
  hours: number[] = [];

  @Input() eventBasicInfo: Event;
  @Input() eventId: string;
  @Output() updateBasicInfo = new EventEmitter();

  constructor(
    public override injector: Injector,
    public modalService: NgbActiveModal,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    public _imagesService: filesService) {
    super(injector);
    for(let i = 0; i < 25; i++)
      this.hours.push(i);

    for(let i = 0; i < 32; i++)
      this.days.push(i);
  }

  ngOnInit(): void {
    this.loadEventTypes();
    this.initForm();
  }


  loadEventTypes() {
    this.httpService.GET(EventTypesController.DropDownForEventEdit(this.eventId))
      .subscribe((eventTypes) => {
        this.eventTypes = eventTypes;
        this.form.get('eventTypeId').patchValue(this.eventTypes.find(e => e.name == this.eventBasicInfo?.typeName).id);
      });
  }

  private initForm(): void {
    console.log(this.eventTypes);
    this.form = this.formBuilder.group({
      name: new FormControl(this.eventBasicInfo?.name, EventValidator.name),
      eventTypeId: new FormControl(null, EventValidator.eventType),
      startDateTime: new FormControl(new Date(this.eventBasicInfo?.startDate), EventValidator.startDate),
      endDateTime: new FormControl(new Date(this.eventBasicInfo?.endDate), EventValidator.endDate),
      coverImage: new FormControl(this.image),
      days: new FormControl(this.eventBasicInfo?.days ?? 0),
      hours: new FormControl(this.eventBasicInfo?.hours ?? 0)
    });
  }


  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();

    body.coverImage = this.image;
    body.startDateTime = body.startDateTime.toUTCString();
    body.endDateTime = body.endDateTime.toUTCString();
    body.days = body.days ?? 0;
    body.hours = body.hours ?? 0;

    this.httpService.PUT(EventsController.UpdateBasicInfo(this.eventId), this.httpService.objectToFormData(body))
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Changes are saved', 'Your changes successfully updated! 🎉');
        this.updateBasicInfo.emit();
      });
  }


  onImageChange(event, imageTag) {
    const file = event.target.files[0] as File;

    if (!file || !this._imagesService.isValidImageExtension(file) || !this._imagesService.isValidFileSize(file, 1024)) return;

    let reader = new FileReader();
    reader.onloadend = () => {
      imageTag.src = reader.result;
    };

    this.image = file;
    reader.readAsDataURL(this.image);
    this.form.markAsDirty();
  }

}
