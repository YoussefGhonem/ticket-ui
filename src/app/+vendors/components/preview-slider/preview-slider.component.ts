import { Component, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { ActivateComponent } from "@shared/components/activate/activate.component";
import { DeactivateComponent } from "@shared/components/deactivate/deactivate.component";
import { ngbModalOptions } from "@shared/default-values";
import { RolesEnum } from "app/+auth/models";
import { UsersController } from "app/+users/controllers";
import { MembersController } from "app/+vendors/controllers";
import { MemberAllowedActions } from "app/+vendors/models";
import { ChangeRoleComponent } from "../commitee-members/change-role/change-role.component";


@Component({
    selector: "preview-slider",
    templateUrl:"./preview-slider.component.html",
    styleUrls: ["./preview-slider.component.scss"]
})


export class PreviewSliderComponent extends BaseComponent implements OnInit, OnChanges{


    @Input("user") user : any = null;
    @Output("loadMembersEvent") loadMembersEvent = new EventEmitter();
    member : any = null;
    userROle = RolesEnum;
    activeId: number = 1;
    memberAllowedActions = MemberAllowedActions;

    constructor(public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public override injector : Injector){
        super(injector)
    }

    ngOnInit(): void {
    }
    ngOnChanges(changes: SimpleChanges): void {
    }

    hasAllowedAction(user: any, action: MemberAllowedActions): boolean {
        return user?.allowedActions?.includes(action);
      }
      
    activate(user: any) {
        const modalRef = this.modalService.open(ActivateComponent, {
          ...ngbModalOptions,
          windowClass: 'modal modal-success'
        });
        modalRef.componentInstance.title = user.name;
        modalRef.componentInstance.id = user.id;
        modalRef.componentInstance.url = UsersController.Activate(user.id);
        modalRef
          .result
          .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.loadMembersEvent.emit())
          .catch(() => {
          });
      }
    
      deactivate(user: any) {
        const modalRef = this.modalService.open(DeactivateComponent, {
          ...ngbModalOptions,
          windowClass: 'modal modal-danger'
        });
        modalRef.componentInstance.title = user.name;
        modalRef.componentInstance.id = user.id;
        modalRef.componentInstance.url = UsersController.Deactivate(user.id);
        modalRef.componentInstance.reason = true;
        modalRef
          .result
          .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.loadMembersEvent.emit())
          .catch(() => {
          });
      }
    
      changeMemberRole(user: any, action: MemberAllowedActions) {
        const modalRef = this.modalService.open(ChangeRoleComponent, {
          ...ngbModalOptions,
          windowClass: 'modal modal-danger'
        });
        modalRef.componentInstance.title = user.name;
        modalRef.componentInstance.action = action;
        console.log(user.allowedActions.indexOf(MemberAllowedActions.UpgradeToAdmin));
        modalRef.componentInstance.url = action == MemberAllowedActions.UpgradeToAdmin ?
          MembersController.UpgradeMember(user.id) :
          MembersController.DowngradeMember(user.id);
        modalRef
          .result
          .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.loadMembersEvent.emit())
          .catch(() => {
          });
      }
}
