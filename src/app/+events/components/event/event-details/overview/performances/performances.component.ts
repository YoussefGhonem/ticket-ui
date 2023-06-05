import { EventValidator } from 'app/+events/validators';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { EventsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { EventAllowedActions } from 'app/+events/models';

@Component({
  selector: 'app-event-performances',
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.scss']
})
export class EventPerformancesComponent extends BaseComponent implements OnInit, OnChanges {
  form: UntypedFormGroup;
  eventId: string;
  editMode: boolean = false;
  @Input() performancesList: string[];
  @Output() loadNewData = new EventEmitter();
  @Input() eventAllowedAction: EventAllowedActions[];
  allowedActions = EventAllowedActions;
  currentPerformanceIndex: number = 0;

  constructor(
    public override injector: Injector,
    private router: ActivatedRoute,
    private _builder: UntypedFormBuilder
  ) {
    super(injector);
    this.performancesList = this.performancesList ?? [];
  }
  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  ngOnChanges(changes: SimpleChanges): void {


  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
    this.initializeForm();
  }


  initializeForm() {
    this.form = this._builder.group({
      performances: this._builder.array([])
    });

  }


  get performances() {
    return this.form?.get("performances") as FormArray<FormGroup>;
  }

  validation() {
    let body = this.form.getRawValue().performances;
    for (var i = 0; i < body.length; i++) {
      if (body[i].performance === "" || !(body[i].performance.length > 5 && body[i].performance.length < 200)) {
        return true;
      }
    }
    return false;
  }

  addPerformance() {
    let body = this.form.getRawValue().performances;
    console.log(body);
    for (var i = 0; i < body.length; i++) {
      if (body[i].performance === "" || !(body[i].performance.length >= 5 && body[i].performance.length <= 200)) {
        return;
      }
    }
    this.performances?.push(new FormGroup({
      id: new FormControl(this.currentPerformanceIndex),
      performance: new FormControl('', EventValidator.performance)
    }));

    this.currentPerformanceIndex += 1;
  }

  getPerformance(performanceIndex: number) {
    return this.performances.at(performanceIndex) as FormGroup
  }

  getPerformanceControl(performanceIndex: number){
    return this.performances.at(performanceIndex).get('performance') as FormControl;
  }

  deletePerformance(performanceIndex: number) {
    console.log(this.form);
    this.performances.removeAt(performanceIndex);
    this.form.markAsDirty();
  }

  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
      });
  }


  onEditClick() {
    this.performances.clear();
    this.currentPerformanceIndex = this.performancesList.length;
    this.editMode = true;
    this.performancesList?.forEach((e, i) => {
      console.log(i);
      this.performances?.push(new FormGroup({
        id: new FormControl(i),
        performance: new FormControl(e, EventValidator.performance)
      }));
    });
  }

  onCancelClick() {
    this.performances.clear();
    this.patch();
    this.editMode = false;
  }

  patch(){
    let performancesGroups = this.performancesList.map((x, i) => {
      {
        id: i;
        performance: x
      }
    });
    this.performances.patchValue(performancesGroups);
  }

  onSaveClick() {
    if (this.form.invalid) {
      return;
    }

    let body = this.form.getRawValue();
    console.log(body);

    this.httpService.PATCH(EventsController.UpdatePerformances(this.eventId), body)
      .subscribe(res => {
        this.notificationService.success("Changes are saved", "update changes successfully");
        this.editMode = false;
        this.loadNewData.emit();
      })
      this.performances.clear();
  }

  onAddClick() {
    this.performancesList?.push('');
  }

  onDeleteClick(element) {
    let index = parseInt(element.srcElement.id);
    this.performancesList.splice(index, 1);
    this.form.markAsDirty();
  }

  validate(): boolean {
    if((this.performancesList.length == 0 && this.getPerformance(0) === undefined)){
      return true;
    }
    return false;
  }

}
