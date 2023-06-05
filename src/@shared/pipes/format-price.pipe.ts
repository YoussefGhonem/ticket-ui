import { Pipe } from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
  name: 'price'
})
export class FormatPricePipe {
  transform(value: number | string, numberOfDigitsAfterDot: number = 2) {

    let zeros: string = '';
    for (let i = 0; i < numberOfDigitsAfterDot; i++) {
      zeros += '0';
    }

    // if (value % 1 != 0) {
    return numeral(value || 0).format(`$ 0,0.${zeros}`);
    // }

    // return numeral(value).format(`$0,0`);
  }
}

// How to use it
// <h1>{{ '15/1/2020' | formatDate}}</h1> result: 1 Jan 2020
