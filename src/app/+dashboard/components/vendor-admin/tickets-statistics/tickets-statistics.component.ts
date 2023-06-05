import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { VendorDashboardController } from 'app/+dashboard/controllers/VendorDashboardController';
import { FrequencyEnum } from 'app/+dashboard/models/enums';
import { EventsController } from 'app/+events/controllers';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tickets-statistics',
  templateUrl: './tickets-statistics.component.html',
  styleUrls: ['./tickets-statistics.component.scss']
})
export class TicketsStatisticsComponent extends BaseComponent implements OnInit {
  status7: any;
  totalTickets: number;
  frequencyEnum = FrequencyEnum;
  events: any[] = [];
  series: any[] = [];
  years: any[] = [];
  data: any;

  form: UntypedFormGroup;

  constructor(
    private _builder: UntypedFormBuilder,
    public override injector: Injector,) {
    super(injector);
  }

  ngOnInit(): void {
    this.initializeForm()
    this.loadData();
    this.loadEvents();
    this._status7('["--vz-success", "--vz-primary", "--vz-warning", "--vz-danger"]');
  }

  onFrequencyChange(frequencyEnum: FrequencyEnum) {
    this.form.controls['frequency'].setValue(frequencyEnum)
    this.form.controls['year'].patchValue(null)
  }

  getYears(earliestYear: number) {
    let date = new Date();
    let year = date.getFullYear();
    let i = year - earliestYear
    this.years = []
    for (let x = 1; x <= i; x++) {
      this.years.push(earliestYear + x);
    }
    this.years.push(earliestYear);
    this.years = this.years.sort();
  }

  initializeForm() {
    this.form = this._builder.group({
      eventId: new FormControl(null),
      frequency: new FormControl(FrequencyEnum.Year),
      year: new FormControl(new Date().getFullYear()),
    });

    this.form?.valueChanges
      .subscribe(res => {
        this.loadData();
      });
  }

  public loadEvents() {

    this.httpService.GET(EventsController.Events, {})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.events = res?.data;
        console.log("this.events", res);
      });


  }

  onTicketSearch(event: any) {
    let value = event.target.value;
    let filters = {
      name: value
    }
    setTimeout(() => {
      this.httpService.GET(EventsController.Events, filters)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.events = res?.data;
        });
    }, 1000)

  }

  loadData() {
    let body: any = this.form.getRawValue()
    if (body.year != null) body.frequency = this.frequencyEnum.Year

    this.httpService.GET(VendorDashboardController.GetTicketStatistics, body)
      .subscribe((data) => {
        console.log("Ticket-statistics", data);
        this.data = data?.data;
        this.series = [this.data?.numberOfActive, this.data?.numberOfScanned, this.data?.numberOfExpired, this.data?.numberOfCanceled]
        this.totalTickets = this.series.reduce((partialSum, a) => partialSum + a, 0)
        if (data?.earliestYear != 0) {
          this.getYears(data?.earliestYear)
        }
        else {
          this.years = []
        }
      });
  }

  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  public _status7(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.status7 = {
      // series: [1, 1, 0, 1],
      labels: ["Active", "Scanned", "Expired", "Cancelled"],
      chart: {
        type: "donut",
        height: 230,
      },
      plotOptions: {
        pie: {
          offsetX: 0,
          offsetY: 0,
          donut: {
            size: "90%",
            labels: {
              show: false,
            }
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      stroke: {
        lineCap: "round",
        width: 0
      },
      colors: colors
    };
  }
}
