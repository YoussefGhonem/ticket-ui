import { QuestionValidator } from './../../../../../validators/question.validators';
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { TicketTypeQuestionsController } from 'app/+events/controllers';
import { EventAllowedActions } from 'app/+events/models';

@Component({
  selector: 'add-question-card',
  templateUrl: './add-question-card.component.html',
  styleUrls: ['./add-question-card.component.scss']
})

export class AddQuestionComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() questionNumber: number;
  @Input() eventId: string;
  @Input() ticketTypeId: string;
  @Output() notify = new EventEmitter();
  @Output() loadNewDate = new EventEmitter();
  @Input() eventAllowedAction: EventAllowedActions[];

  allowedActions = EventAllowedActions;
  form: UntypedFormGroup;

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
    this.form = this._formBuilder.group({
      question: new FormControl(null, QuestionValidator.question),
      sortOrder: new FormControl(this.questionNumber),
      choices: this._formBuilder.array([])
    });
  }

  get Choices() {
    return this.form?.get('choices') as FormArray;
  }

  addChoice() {
    for (let i = 0; i < this.Choices.controls.length; i++) {
      if (this.Choices.controls[i].value === '') return;
    }
    this.Choices?.push(new FormControl('', QuestionValidator.choice));
    this.form.markAsDirty();
  }

  getChoice(choiceIndex: number) {
    return this.Choices?.at(choiceIndex) as FormControl;
  }

  deleteChoice(choiceIndex: number) {
    this.Choices?.removeAt(choiceIndex);
    this.form.markAsDirty();
  }

  onDeleteClick() {
    this.notify.emit();
  }

  hideLabelAndShowInput(index: number) {

  }
  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }
  onAddClick() {
    if (this.form.invalid) return;

    // if(this.Choices.length < 2) {
    //   this.notificationService.error("Add more choices", "Number of choices must be more than 1");
    //   return;
    // }

    let body = this.form.getRawValue();
    this.httpService.POST(TicketTypeQuestionsController.CreateTicketTypeQuestion(this.eventId, this.ticketTypeId), body)
      .subscribe(res => {
        this.notificationService.success("Create Question Success", "Question is created successfully! 🎉");
        this.notify.emit();
        this.loadNewDate.emit();
      })
  }

  onClickFocus(event: any) {
    event.target.focus();
  }

  validate() {
    return this.form.getRawValue().choices.length == 0;
  }

}
