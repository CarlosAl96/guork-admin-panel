import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFromNow',
  standalone: true,
})
export class DateFromNowPipe implements PipeTransform {
  transform(fechaISO: string): string {
    const _fecha = fechaISO.replace('Z', '');
    const now: Date = new Date();
    const targetDate: Date = new Date(_fecha);

    const diffInMs = targetDate.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      return `en ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInDays < 0) {
      return `hace ${Math.abs(diffInDays)} día${
        Math.abs(diffInDays) > 1 ? 's' : ''
      }`;
    } else {
      return 'hoy';
    }
  }
}
