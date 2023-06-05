import { Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'time'
})
export class FormatTimePipe {
  transform(value: string) {
    if (!moment(new Date(value), 'd MMM y').isValid() || !value) {
      return '-'
    }
    return moment(value).format('hh:mm a');
  }
}

// How to use it
// <h1>{{ '03:13' | time}}</h1> result: 1 Jan 2020 
