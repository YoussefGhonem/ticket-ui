import { Pipe } from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
  name: 'integer'
})
export class FormatIntegerPipe {
  transform(value: number | string) {
    if (!value) return 0;
    return numeral(value).format('0,0');
  }
}

// How to use it
// <h1>{{ '15/1/2020' | formatDate}}</h1> result: 1 Jan 2020
