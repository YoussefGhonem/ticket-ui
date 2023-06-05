import { Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'date'
})
export class FormatDatePipe {
  transform(value: string, format: string = null) {
    if (!moment(new Date(value), 'd MMM y').isValid() || !value
        || new Date(0) >= new Date(value)) {
      return '-';
    }
    return format != null ? moment(new Date(value)).format('D MMM YYYY') : moment(new Date(value)).format('MMM D, YYYY');
  }
}

// How to use it
// <h1>{{ '15/1/2020' | formatDate}}</h1> result: 1 Jan 2020
