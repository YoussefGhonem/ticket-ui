import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { BaseComponent } from "@shared/base/base.component";

@Component({
    selector: "slider-header",
    templateUrl:"./slider-header.component.html",
    styleUrls : ["./slider-header.component.scss"]
})

export class SliderHeaderComponent extends BaseComponent implements OnInit, OnChanges{
    @Input("user") user : any = null;


    ngOnInit(): void {
    }
    ngOnChanges(changes: SimpleChanges): void {
    }
}
