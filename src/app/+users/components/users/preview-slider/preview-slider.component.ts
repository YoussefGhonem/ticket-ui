import { RolesEnum } from './../../../../+auth/models/enums';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { UserAllowedActions } from 'app/+users/models';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivateComponent } from '@shared/components/activate/activate.component';
import { ngbModalOptions } from '@shared/default-values';
import { UsersController } from 'app/+users/controllers';
import { UnlockComponent } from '@shared/components/unlock/unlock.component';
import { DeactivateComponent } from '@shared/components/deactivate/deactivate.component';


@Component({
  selector: 'preview-slider',
  templateUrl: './preview-slider.component.html',
  styleUrls: ['./preview-slider.component.scss']
})

export class PreviewSliderComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('user') user: any = null;
  @Output('loadUsersEvent') loadUsersEvent = new EventEmitter();
  member : any =null;
  userRole: RolesEnum;
  activeId: number = 1;
  allowedActions = UserAllowedActions;

  constructor(
      public override injector: Injector,
      public activeModal: NgbActiveModal,
      public modalService: NgbModal,
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  hasAllowedAction(user: any, action: UserAllowedActions): boolean {
    return user?.allowedActions?.includes(action);
  }

  activate(user: any) {
    const modalRef = this.modalService.open(ActivateComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success'
    });
    modalRef.componentInstance.title = user.name;
    modalRef.componentInstance.url = UsersController.Activate(user.id);

    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.loadUsersEvent.emit())
      .catch(() => {
      });
  }

  unlock(user: any) {
    const modalRef = this.modalService.open(UnlockComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success'
    });
    modalRef.componentInstance.title = user.name;
    modalRef.componentInstance.url = UsersController.Unlock(user.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.loadUsersEvent.emit())
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
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.loadUsersEvent.emit())
      .catch(() => {
      });
  }
}
