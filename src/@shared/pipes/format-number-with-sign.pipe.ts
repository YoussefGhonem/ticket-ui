import { Pipe } from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
  name: 'numberWithSgin'
})
export class FormatNumberWithSignPipe {
  transform(number: number, numberOfDigitsAfterDot: number = 2) {

    if (number == 0) {
      return 0;
    }
    else {
      // hundreds
      if (number <= 999) {
        return number;
      }
      // thousands
      else if (number >= 1000 && number <= 999999) {
        return numeral(number / 1000).format(`0,0.00`) + 'K';
      }
      // millions
      else if (number >= 1000000 && number <= 999999999) {
        return numeral(number / 1000000).format(`0,0.00`) + 'M';
      }
      // billions
      else if (number >= 1000000000 && number <= 999999999999) {
        return numeral(number / 1000000000).format(`0,0.00`) + 'B';
      }
      else
        return number;
    }
  }
}

