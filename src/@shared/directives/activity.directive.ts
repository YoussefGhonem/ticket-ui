import { AbstractControl } from '@angular/forms';
import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";
import { EventAuditEnum } from 'app/+events/models';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

@Directive({
  selector: "[activity]"
})
export class FormControlValidatorDirective implements OnInit {

  @Input('activity') activity: any;
  @Input('type') type: string = 'EventAudit';
  private _el: ElementRef;

  constructor(el: ElementRef) {
    this._el = el;
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
        let eventMembers = this.activity.extraInfo.dependanciesList.map(x => JSON.parse(x.changedTo));
        eventMembers.forEach(x => ``);
      }
      else {
      description += 'From: <br>';
      this.activity.extraInfo.dependanciesList.forEach(x => {
        if(x.changedFrom == '') return;
        description += new HumanizePipe().transform(x.property) + ': ' + x.changedFrom + ' <br>'
      });
      description += 'To: <br>';
      this.activity.extraInfo.dependanciesList.forEach(x => description += new HumanizePipe().transform(x.property) + ': ' + x.changedTo + ' <br>');
    }
    }
    else {
      this.activity.extraInfo.dependanciesList.forEach(x => description += new HumanizePipe().transform(x.property) + ': ' + x.changedFrom + ' <br>');
    }
    return description;
  }

}
