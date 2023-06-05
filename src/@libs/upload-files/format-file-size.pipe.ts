import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatFileSize'
})
export class FormatFileSizePipe {
  transform(sizeInBytes: number) {
    let _size = sizeInBytes;
    const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
    let i = 0;
    while (_size > 900) {
      _size /= 1024;
      i++;
    }

    return (Math.round(_size * 100) / 100) + ' ' + fSExt[i];
  }
}

// How to use it
// <h1>{{ '15/1/2020' | formatDate}}</h1> result: 1 Jan 2020
