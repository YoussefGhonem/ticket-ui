import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input } from "@angular/core";

@Component({
    selector: 'location-description',
    templateUrl: './location-description.component.html',
    styleUrls: ['./location-description.component.scss']
})
export class LocationDescriptionComponent extends BaseComponent{

    @Input('url') url: string;
    @Input('description') description: string;
    constructor(public override injector: Injector){
        super(injector);
    }

    getLink(val: string): string {

        if(val?.startsWith('http') == false && val?.startsWith('https') == false){
          val = 'http://' + val;
        }
  
      return val;
    }
}
