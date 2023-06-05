import { EventMembersController } from 'app/+events/controllers';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { MembersController } from 'app/+vendors/controllers';
import { RolesEnum } from 'app/+auth/models';

@Component({
  selector: 'app-assign-committee-members',
  templateUrl: './assign-committee-members.component.html',
  styleUrls: ['./assign-committee-members.component.scss']
})
export class AssignCommitteeMembersComponent extends BaseComponent implements OnInit {
  @Input('eventId') eventId: string;
  @Input('assignedCommitteeMembersIds') assignedCommitteeMembersIds: any[];

  searchForm: FormGroup;
  committeeMembers: any[]
  committeeMembersIds: any[] = []
  total: number = 0;

  constructor(
    public modalService: NgbModal,
    public modalActiveService: NgbActiveModal, public activeModal: NgbActiveModal,
    public override injector: Injector,
    private _formBuilder: FormBuilder) {
    super(injector);
  }

  onCheckboxChange(item, event) {
    let isChecked = event.target.checked

    if (isChecked) {
      if (!this.committeeMembersIds?.includes(item.id)) {
        this.committeeMembersIds?.push(item?.id);
        console.log("add");
      }
    }
    else if (!isChecked && this.committeeMembersIds?.includes(item.id)) {
      const indexOfObject = this.committeeMembersIds.findIndex((id) => { return id === item?.id });
      this.committeeMembersIds?.splice(indexOfObject, 1);
      console.log("splice");

    }
    console.log(" this.committeeMembersIds", this.committeeMembersIds);
  }

  patchCommitteeMembers(id: any): boolean {
    return !!this.assignedCommitteeMembersIds?.includes(id);
  }

  private initSearchForm(): void {
    this.searchForm = this._formBuilder.group({
      // Filters
      searchWord: new FormControl(null),
      isActive: new FormControl(true),
      role: new FormControl(null),
    });
    this.searchForm.controls['searchWord'].valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.loadCommitteeMembers();
        console.log("wssssssssssssssss");

      });
  }

  public loadCommitteeMembers() {
    let filters = null;
    if (this.searchForm) filters = this.searchForm.getRawValue();

    this.httpService.GET(MembersController.GetAssignMembersToEvent(this.eventId), filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.committeeMembers = res;
        this.committeeMembers = this.committeeMembers.filter(x => !this.committeeMembersIds.includes(x.id));
      });
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadCommitteeMembers();
    this.assignedCommitteeMembersIds?.forEach((value) => {
      this.committeeMembersIds.push(value)
    })
    console.log("assignedCommitteeMembersIds", this.assignedCommitteeMembersIds);

  }

  submit() {
    let body = {
      memberIds: this.committeeMembersIds
    }
    console.log("assign body", body);

    this.httpService.PUT(EventMembersController.AssignMembersToEvent(this.eventId), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.modalActiveService.close(true);
        this.notificationService.success('', 'Members Assigned successfully! 🎉');
      });
  }
}
