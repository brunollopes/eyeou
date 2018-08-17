import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'converSize'
})
export class ConverSizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (value === 0) return 'n/a'
    const i = Math.floor(Math.log(value) / Math.log(1024))
    if (i === 0) return `${value} ${sizes[i]})`
    return `${(value / (1024 ** i)).toFixed(1)} ${sizes[i]}`
  }

}
