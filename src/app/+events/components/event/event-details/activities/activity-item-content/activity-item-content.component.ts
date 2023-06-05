import { PreviewActivityChangesComponent } from './../preview-activity-changes/preview-activity-changes.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { EventsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';
import { ngbModalOptions } from '@shared/default-values';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { EventAuditEnum } from 'app/+events/models';

@Component({
  selector: 'activity-item-content',
  templateUrl: './activity-item-content.component.html',
  styleUrls: ['./activity-item-content.component.scss']
})

export class ActivityItemContentComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() activity: any;
  auditEnum: EventAuditEnum;

  constructor(
      public override injector: Injector,
      private modalService: NgbModal,
      private activeModal: NgbActiveModal
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.activity);
  }

  ngOnInit(): void {

  }

  prepareDescription(): string {
    let description = "";
    if(this.activity.extraInfo.action == EventAuditEnum.Created){
      this.activity.extraInfo.dependanciesList.forEach(x => description += new HumanizePipe().transform(x.property) + ': ' + x.changedTo + ' <br>');
    }
    else if (this.activity.extraInfo.action == EventAuditEnum.Updated) {
      if(this.activity.extraInfo.dependanciesList.filter(x => x.property == 'EventMember').length > 0){
      }
      else {
      description += 'From: <br>';
      this.activity.extraInfo.dependanciesList.forEach(x => {
        if(x.changedFrom == '') {
          return;
        }
        description += new HumanizePipe().transform(x.property) + ': ' + x.changedFrom + ' <br>'
      });

      if(description == 'From: <br>') description = '';
      description += 'To: <br>';
      this.activity.extraInfo.dependanciesList.forEach(x => description += new HumanizePipe().transform(x.property) + ': ' + x.changedTo + ' <br>');
    }
    }
    else {
      this.activity.extraInfo.dependanciesList.forEach(x => description += new HumanizePipe().transform(x.property) + ': ' + x.changedFrom + ' <br>');
    }
    return description;
  }

  getName(x: any){
    return JSON.parse(x.changedTo)['Name'];
  }

  getImageUrl(x: any){
    return JSON.parse(x.changedTo)['ImageUrl'];
  }

  previewActivity(property: string, value: string) {
    const modalRef = this.modalService.open(PreviewActivityChangesComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
    modalRef.componentInstance.property = property;
    modalRef.componentInstance.value = value;

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });

  }

}
