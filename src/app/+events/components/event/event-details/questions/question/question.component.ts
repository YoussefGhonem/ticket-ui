import { QuestionValidator } from './../../../../../validators/question.validators';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventAllowedActions, EventStatusEnum, Question } from './../../../../../models';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TicketTypeQuestionsController, EventsController } from 'app/+events/controllers';
import { BaseComponent } from '@shared/base/base.component';
import { Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { DeleteComponent } from '@shared/components/delete/delete.component';
import { ngbModalOptions } from '@shared/default-values';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() question: Question;
  @Input() eventId: string;
  @Input() index: number;
  @Output() loadNewData = new EventEmitter();
  @Input() ticketTypeId: string;
  @Input() eventAllowedAction: EventAllowedActions[];
  @Input() eventBasicInfo: any;
  eventStatus = EventStatusEnum;

  allowedActions = EventAllowedActions;
  form: UntypedFormGroup;
  editMode: boolean = false;
  styleChoice = '';

  constructor(
    public override injector: Injector,
    private _formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.question?.choices?.forEach(choice => {
      this.Choices?.controls?.push(this._formBuilder.group({
        id: new FormControl(choice.id),
        choice: new FormControl(choice.choice, QuestionValidator.choice)
      }));
    });
  }

  changeStyleChoice(question: any, currentChoice): string {

    var maxObj = question.choices.reduce(function (max, obj) {
      return obj.totalAnswers > max.totalAnswers ? obj : max;
    });
    var minObj = question.choices.reduce(function (max, obj) {
      return obj.totalAnswers < max.totalAnswers ? obj : max;
    });

    console.log("currentChoice", currentChoice);

    if (currentChoice.totalAnswers == maxObj.totalAnswers && maxObj.totalAnswers != 0) {
      this.styleChoice = 'ri-checkbox-circle-line'
      return 'success'
    }
    else if (currentChoice.totalAnswers == minObj.totalAnswers) {
      this.styleChoice = 'ri-close-circle-line'
      return 'danger'
    }
    else {
      this.styleChoice = 'ri-indeterminate-circle-line'
      return 'primary'
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      question: new FormControl(this.question?.question, QuestionValidator.question),
      sortOrder: new FormControl(this.question?.sortOrder),
      choices: this._formBuilder.array([])
    });
  }

  get Choices() {
    return this.form?.get('choices') as FormArray<FormGroup>;
  }

  addChoice() {
    for (let i = 0; i < this.Choices.controls.length; i++) {
      if (this.Choices.controls[i].get('choice').value === '') return;
    }
    this.Choices?.push(this._formBuilder.group({
      id: new FormControl(null),
      choice: new FormControl('', QuestionValidator.choice)
    }));
    this.form.markAsDirty();
  }

  getChoice(choiceIndex: number): FormGroup {
    return this.Choices?.at(choiceIndex) as FormGroup;
  }

  getChoiceControl(choiceIndex: number): FormControl {
    return this.Choices?.at(choiceIndex).controls['choice'] as FormControl;
  }

  deleteChoice(choiceIndex: number) {
    this.Choices?.removeAt(choiceIndex);
    this.form.markAsDirty();
  }

  fillFormArray() {
    this.Choices?.clear();
    this.question?.choices?.forEach(c => {
      this.Choices.push(new FormGroup({
        id: new FormControl(c.id),
        choice: new FormControl(c.choice, QuestionValidator.choice)
      }));
    });
  }

  onClickDelete() {
    const modalRef = this.modalService.open(DeleteComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });

    modalRef.componentInstance.title = this.question?.question;
    modalRef.componentInstance.url = TicketTypeQuestionsController
      .DeleteTicketTypeQuestion(this.eventId, this.ticketTypeId, this.question.id);

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.loadNewData.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }

  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  onClickEdit() {
    this.fillFormArray();
    this.editMode = true;
  }

  onCancelClick() {
    this.editMode = false;
    this.form.markAsPristine();
  }

  onSaveClick() {
    if (this.form.invalid) return;

    // if(this.Choices.length < 2) {
    //   this.notificationService.error("Add more choices", "Number of choices must be more than 1");
    //   return;
    // }

    let body = this.form.getRawValue();
    console.log(body);

    this.httpService.PUT(TicketTypeQuestionsController.UpdateTicketTypeQuestion(this.eventId, this.ticketTypeId, this.question.id), body)
      .subscribe(res => {
        this.notificationService.success("Update Question Success", "Your question has been saved successfully");
        this.loadNewData.emit();
      })
  }

  onClickFocus(event: any) {
    event.target.focus();
  }

  lastInput(event: any, index: number) {
    console.log("hi");

    if (index != this.Choices.length - 1) return;

    console.log("hi");
    event.target.focus();
  }

  isLast(i: number): boolean {
    if (this.Choices.length - 1 != i) return false;
    return true;
  }

  validate() {
    return this.form.getRawValue().choices.length == 0;
  }
}
