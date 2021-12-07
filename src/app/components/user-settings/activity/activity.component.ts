import { MediaObserver } from '@angular/flex-layout';
import { Component, OnInit } from '@angular/core';
import { ActivityService } from './activity.service';
import { DatePipe } from '@angular/common';


export class CalendarDay {
  date: Date;
  isPastDate: boolean;
  isToday: boolean;
  userWasActive: boolean;

  constructor(d: Date) {
    this.date = d;
    this.isPastDate = d < new Date();
    this.isToday = d == new Date();
    this.userWasActive = false;
  }
}

export interface UserActivity {
  date: Date;
}

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  mediaSuffix!: string;
  calendar: CalendarDay[] = [];
  monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
  monthName!: string;

  constructor(private activityService: ActivityService, private mediaObserver: MediaObserver, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.mediaObserver.asObservable().subscribe(data => {
      this.mediaSuffix = data[0].suffix;
    });

    this.monthName = new Date().toLocaleString('default', { month: 'long' });
    this.generateCalendarDays();
    this.activityService.getThisMonthActivity().subscribe((data: UserActivity[]) => {
      for (let userActivity of data) {
        let res = this.datePipe.transform(userActivity.date, 'yyyy/MM/dd');
        let res2 = res ? res : 'error';
        let dayInCalendar = this.calendar.find(elem => elem.date.getTime() === new Date(res2).getTime());
        if (dayInCalendar instanceof CalendarDay) {
          dayInCalendar.userWasActive = true;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  private generateCalendarDays(): void {
    this.calendar = [];
    let dateToAdd: Date = new Date();
    dateToAdd.setFullYear(dateToAdd.getFullYear(), dateToAdd.getMonth(), 1);
    let monthDaysCount = this.getMonthDaysNumber();

    for (var i = 0; i < monthDaysCount; i++) {
      let date = new Date(dateToAdd);
      date.setHours(0, 0, 0, 0);
      this.calendar.push(new CalendarDay(date));
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }

    let today = this.calendar.find(elem => {
      return elem.date.getTime() === new Date(new Date().toDateString()).getTime();
    });
    if (today instanceof CalendarDay) {
      today.isToday = true;
    }
  }

  private getMonthDaysNumber(): number {
    let dt = new Date();
    let daysInMonth = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
    return daysInMonth;
  }

}
