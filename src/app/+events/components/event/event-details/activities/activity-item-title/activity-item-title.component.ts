import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { EventsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewActivityChangesComponent } from '../preview-activity-changes/preview-activity-changes.component';
import { ngbModalOptions } from '@shared/default-values';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

@Component({
  selector: 'activity-item-title',
  templateUrl: './activity-item-title.component.html',
  styleUrls: ['./activity-item-title.component.scss']
})

export class ActivityItemTitleComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() activity: any;

  constructor(
      public override injector: Injector,
      private modalService: NgbModal,
      private activeModal: NgbActiveModal
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    console.log(this.activity);
  }

  presentDate(date: string) {
    let newDate = new Date(date);
    let time = newDate.toLocaleTimeString('en-Us', {
      hour: '2-digit',
      minute:'2-digit'
    });
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()} - ${time}`;
  }

  onClick(item: any){
    console.log(item);
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

  returnHumanized(value: string): string {
    return new HumanizePipe().transform(value);
  }

}
