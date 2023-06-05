import { Question } from './../../../../models/event-question.model';
import { ActivatedRoute } from '@angular/router';
import { TicketTypeQuestionsController, TicketTypesController } from 'app/+events/controllers';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { EventAllowedActions } from 'app/+events/models';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AnyKindOfDictionary } from 'lodash';

@Component({
  selector: 'app-event-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})

export class EventQuestionsComponent extends BaseComponent implements OnInit {
  @Input() eventAllowedAction: EventAllowedActions[];
  @Input('eventBasicInfo') eventBasicInfo: any;
  @Output('loadActivities') loadActivities = new EventEmitter();

  allowedActions = EventAllowedActions;
  form: FormGroup;
  questions: Question[];
  ticketTypes: Question[];
  eventId: string;
  addQuestion: boolean = false;

  constructor(public override injector: Injector, private _formBuilder: FormBuilder, private router: ActivatedRoute) {
    super(injector);
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.getEventIdFromQuery();
    this.loadTicketTypes();
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      id: new FormControl(),
    });
    this.form.valueChanges
      .subscribe(res => {
        this.loadQuestions();
      });
  }
  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        this.eventId = params.get('id');
      });
  }

  loadActivitiesEvent() {
    this.loadActivities.emit();
  }

  loadQuestions() {
    if (this.form.getRawValue()?.id == null) return;
    this.httpService.GET(TicketTypeQuestionsController.GetTicketTypeQuestions(this.eventId, this.form.getRawValue()?.id))
      .subscribe(res => {
        console.log(res);
        this.questions = res;
      });
  }

  onClear() {
    this.questions = [];
  }

  loadTicketTypes() {
    this.httpService.GET(TicketTypesController.GetTicketTypesDropdown(this.eventId))
      .subscribe(res => {
        console.log(res);
        this.ticketTypes = res;
      });
  }

  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  onAddClick() {
    this.addQuestion = true;
  }

  onDoneClick() {
    this.addQuestion = false;
  }

}
