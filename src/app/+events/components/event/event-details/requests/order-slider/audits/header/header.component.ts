import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

@Component({
  selector: 'request-audits-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class RequestAuditHeaderComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() activity: any;

  constructor(
      public override injector: Injector
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


  returnHumanized(value: string): string {
    return new HumanizePipe().transform(value);
  }

}
