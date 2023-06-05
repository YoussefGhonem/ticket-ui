import { Pipe } from '@angular/core';

@Pipe({
  name: 'hidePassword'
})
export class HidePasswordPipe {
  transform(value: string, enabled = true): string {
    return enabled
        ? Array(value.length).fill('*').join('')
        : value;
  }
}

// How to use it
// <h1>{{ 'password' | hidePassword}}</h1> result: '********'
