import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalFormat',
  standalone: true
})
export class CapitalFormatPipe implements PipeTransform {
  transform(capitals: string[]): string {
    return capitals?.length ? capitals.join(', ') : 'N/A';
  }
}
