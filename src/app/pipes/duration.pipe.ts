import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  constructor(public translate: TranslateService) {

  }

  transform(value: any, args?: any): any {
    switch(value) {
      case 7:
        return `1 ${this.translate.lang.week}`;
      case 30:
        return `1 ${this.translate.lang.month}`;
      default:
        return `${value} ${this.translate.lang.days}`;
    }
  }

}
