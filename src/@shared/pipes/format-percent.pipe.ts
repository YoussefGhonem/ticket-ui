import { Pipe } from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
  name: 'percent'
})
export class FormatPercentPipe {
  transform(value: number | string, numberOfDigitsAfterDot: number = 2) {
    if (!value) return 0;

    let zeros: string = '';
    for (let i = 0; i < numberOfDigitsAfterDot; i++) {
      zeros += '0';
    }

    value = Number(value);

    if (value % 1 != 0) {
      return numeral(value).format(`0,0.${zeros}`) + '%';
    }

    return numeral(value).format(`0,0`) + '%';
  }
}

// How to use it
// <h1>{{ '15/1/2020' | formatDate}}</h1> result: 1 Jan 2020
