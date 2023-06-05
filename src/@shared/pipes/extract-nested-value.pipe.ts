import { Pipe } from '@angular/core';

@Pipe({
  name: 'extractNestedValue'
})
export class ExtractNestedValuePipe {
  transform(row: any, prop: string) {

    let props = prop.split('.');
    let result: string | null = null;

    if (!props || props?.length == 0 || !row) result = null;
    else if (props?.length == 1) result = row[props[0]];
    else if (props?.length == 2 && row[props[0]]) result = row[props[0]][props[1]];
    else if (props?.length == 3 && row[props[0]][props[1]]) result = row[props[0]][props[1]][props[2]];
    else if (props?.length == 4 && row[props[0]][props[1]][props[2]]) result = row[props[0]][props[1]][props[2]][props[3]];
    else if (props?.length == 5 && row[props[0]][props[1]][props[2]][props[3]]) result = row[props[0]][props[1]][props[2]][props[3]][props[4]];
    else if (props?.length == 6 && row[props[0]][props[1]][props[2]][props[3]][props[4]]) result = row[props[0]][props[1]][props[2]][props[3]][props[4]][props[5]];
    else if (props?.length == 7 && row[props[0]][props[1]][props[2]][props[3]][props[4]][props[5]]) result = row[props[0]][props[1]][props[2]][props[3]][props[4]][props[5]][props[6]];

    return result;
  }
}

// How to use it
// <h1>{{ 'yourText' | humanize}}</h1> result: Your Text
