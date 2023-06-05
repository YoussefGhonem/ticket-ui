import { Component, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { ActivateComponent } from "@shared/components/activate/activate.component";
import { DeactivateComponent } from "@shared/components/deactivate/deactivate.component";
import { ngbModalOptions } from "@shared/default-values";
import { RolesEnum } from "app/+auth/models";
import { EventMembersController } from "app/+events/controllers";
import { EventAllowedActions } from "app/+events/models";
import { UsersController } from "app/+users/controllers";
import { MembersController } from "app/+vendors/controllers";
import { MemberAllowedActions } from "app/+vendors/models";
import { MakeContactMemberComponent } from "../make-contact-member/make-contact-member.component";
import { UnassignMemberComponent } from "../unassign-member/unassign-member.component";


@Component({
    selector: "preview-slider",
    templateUrl:"./preview-slider.component.html",
    styleUrls: ["./preview-slider.component.scss"]
})


export class PreviewSliderComponent extends BaseComponent implements OnInit, OnChanges{


    @Input("user") user : any = null;
    @Input('id') id: any;
    @Input() allowedAction: EventAllowedActions[];
    @Input('offcanvas') offcanvas: any;
    @Output("loadMembersEvent") loadMembersEvent = new EventEmitter<string>();
    member : any = null;
    userRole = RolesEnum;
    activeId: number = 1;
    memberAllowedActions = MemberAllowedActions;
    eventAllowedActions = EventAllowedActions;

    constructor(public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public override injector : Injector){
        super(injector)
    }

    ngOnInit(): void {
    }
    ngOnChanges(changes: SimpleChanges): void {
    }
    
    eventAllowedAction(action: EventAllowedActions): boolean {
      let allowedActions = this.allowedAction as Array<EventAllowedActions>;
      return allowedActions?.includes(action);
    }

    memberAllowedAction(member: any, action: MemberAllowedActions): boolean {
      let allowedActions = member?.memberAllowedActions as Array<MemberAllowedActions>
      return allowedActions?.includes(action);
    }


      Unassigned(item: any) {
        const modalRef = this.modalService.open(UnassignMemberComponent, {
          ...ngbModalOptions,
          windowClass: 'modal modal-warning'
        });
        modalRef.componentInstance.title = item.committeeMember.name;
    
        modalRef.componentInstance.url = EventMembersController.RemoveMemberFromEvent(this.id, item.committeeMember.id);
        modalRef
          .result
          .then((actionCompleted: boolean) => {
            if (actionCompleted) {
              this.activeModal.close(true);
              this.loadMembersEvent.emit(item.committeeMember.id);
              this.offcanvas.dismiss('Cross click');
            }
          })
          .catch(() => {
          });
      }
    
      makeContact(item: any) {
        const modalRef = this.modalService.open(MakeContactMemberComponent, {
          ...ngbModalOptions,
          windowClass: 'modal modal-warning'
        });
        modalRef.componentInstance.title = item.committeeMember.name;
        modalRef.componentInstance.url = EventMembersController.SetMemberAsContact(this.id, item.committeeMember.id);
        modalRef
          .result
          .then((actionCompleted: boolean) => {
            if (actionCompleted) {
              this.activeModal.close(true);
              this.loadMembersEvent.emit(item.committeeMember.id);
            }
          })
          .catch(() => {
          });
      }
    
      makeUnContact(item: any) {
        const modalRef = this.modalService.open(MakeContactMemberComponent, {
          ...ngbModalOptions,
          windowClass: 'modal modal-warning'
        });
        modalRef.componentInstance.title = item.committeeMember.name;
        modalRef.componentInstance.url = EventMembersController.RemoveContactStatusFromAssignedMember(this.id, item.committeeMember.id);
        modalRef.componentInstance.isContact = false;
        modalRef
          .result
          .then((actionCompleted: boolean) => {
            if (actionCompleted) {
              this.activeModal.close(true);
              this.loadMembersEvent.emit(item.committeeMember.id);
            }
          })
          .catch(() => {
          });
      }
}
