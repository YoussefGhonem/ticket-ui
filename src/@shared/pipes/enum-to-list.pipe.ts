import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToList'
})
export class EnumToListPipe implements PipeTransform {
  transform(value: any, showEmptyOption: boolean = false): any {
    const items: any[] = [];
    if (showEmptyOption) {
      items.push({id: '', name: '---choose---'});
    }
    for (const key in value) {
      const isValueProperty = parseInt(key, 10) >= 0;
      if (!isValueProperty) {
        continue;
      }
      items.push({id: Number(key), name: value[key]});
    }
    return items;
  }
}

// How to use it
// <option *ngFor="let option of (YourEnum | enumToList)" [value]="option.id">{{
//   option.name
// }}</option>
