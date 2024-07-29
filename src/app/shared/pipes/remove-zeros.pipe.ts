import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeZeros'
})
export class RemoveZerosPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (!value) return value;
    return value.replace(/^0+/, '');
  }

}
