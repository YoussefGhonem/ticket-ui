import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";

@Component({
  selector: 'details-tab',
  templateUrl: './details-tab.component.html',
  styleUrls: ['./details-tab.component.scss']
})

export class DetailsTabComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('user') user: any = null;
  constructor(
      public override injector: Injector,
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  getAddress() {
    let address: string = '';
    let street = this.user?.address?.street;
    let city = this.user?.address?.city;
    let country = this.user?.address?.country?.name;
    if (street) {
      address += street;
    }
    if (city) {
      address = street ? address + ', ' + city : address + city;
    }
    if (country) {
      address = street || city ? address + ', ' + country : address + country;
    }
    return address;
  }

}
