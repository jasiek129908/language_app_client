import { CalendarDay } from './activity.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk'
})
export class ChunkPipe implements PipeTransform {

  transform(calendarDaysArray: any, chunkSize: number): any {
    let calendarDays: any[] = [];
    let weekDays: any[] = [];
    let flag: boolean = true;

    calendarDaysArray.map((day: CalendarDay, index: number) => {
      if (flag && day.date.getDay() !== 1) {
        for (let i: number = day.date.getDay() - 1; i >= 1; i--) {
          let temp = new Date();
          temp.setFullYear(day.date.getFullYear(), day.date.getMonth(), i);
          weekDays.push(null);
          index++;
        }
        weekDays.push(day);
        if (++index % chunkSize === 0) {
          calendarDays.push(weekDays);
          weekDays = [];
        }
        flag = false;
      } else {
        weekDays.push(day);
        if (weekDays.length % chunkSize === 0 || this.getMonthDaysNumber() === index + 1) {
          calendarDays.push(weekDays);
          weekDays = [];
        }
      }
    });
    return calendarDays;
  }
  private getMonthDaysNumber(): number {
    let dt = new Date();
    let daysInMonth = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
    return daysInMonth;
  }
}
