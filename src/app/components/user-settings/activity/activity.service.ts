import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserActivity } from './activity.component';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private readonly serverUrl: string = 'http://localhost:8080/api/activity';

  constructor(private http: HttpClient) {}

  getThisMonthActivity(): Observable<UserActivity[]> {
    return this.http.get<UserActivity[]>(this.serverUrl);
  }
}
