import { Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'datetime'
})
export class FormatDatetimePipe {
  transform(value: string, format: string = null) {
    if (!moment(new Date(value), 'd MMM y').isValid() || !value) {
      return '-'
    }
    return format != null ? moment(value).format('D MMM YYYY, hh:mm A') : moment(value).format('MMM D, YYYY, hh:mm A');
  }
}

// How to use it
// TODO: Use built in date pipe to allow the user to define the format he want
// <h1>{{ '15/1/2020' | formatDate}}</h1> result: 1 Jan 2020 
