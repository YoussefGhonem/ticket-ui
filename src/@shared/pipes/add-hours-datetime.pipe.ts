import { Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'addHours'
})
export class AddHoursPipe {
  transform(value: string, hours: number, format: string = null) {
    if (!moment(new Date(value), 'd MMM y').isValid() || !value) {
      return '-'
    }
    let date = new Date(value);
    date.setHours(date.getHours() + hours);
    return format != null ? moment(date).format('D MMM YYYY, hh:mm A') : moment(date).format('MMM D, YYYY, hh:mm A');
  }
}

// How to use it
// TODO: Use built in date pipe to allow the user to define the format he want
// <h1>{{ '15/1/2020' | formatDate}}</h1> result: 1 Jan 2020 
