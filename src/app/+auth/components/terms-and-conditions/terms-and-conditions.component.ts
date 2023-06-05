import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "@shared/base/base.component";
import { SettingsController } from "app/+settings/controllers";

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent extends BaseComponent implements OnInit {

  year: number = new Date().getFullYear();
  terms: string;

  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.getVendorTermsAndConditions();
  }

  getVendorTermsAndConditions() {
    this.httpService.GET(SettingsController.GetVendorTermsAndConditions)
        .subscribe((terms) => {
          this.terms = terms;
          console.log(terms);
        })
  }

}
