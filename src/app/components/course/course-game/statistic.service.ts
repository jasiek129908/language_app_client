import { Observable } from 'rxjs';
import { StatisitcRequestPayload } from './statisticRequest.payload';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WordSetResponsePayLoad } from '../courses/allWordSetResponse.payload';
import { StatisitcResponsePayload } from '../../user-settings/charts/statisticResponse.payload';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private readonly serverUrl: string = 'http://localhost:8080/api/statistic';

  constructor(private http: HttpClient) { }

  saveStatistic(statistic: StatisitcRequestPayload) {
    return this.http.post(this.serverUrl, statistic);
  }

  getAllUserWordSetWithStatistic(gameType: string): Observable<WordSetResponsePayLoad[]> {
    return this.http.get<WordSetResponsePayLoad[]>(this.serverUrl + '/' + gameType);
  }

  getAllStatisitcByWordSetIdAndType(wordSetId: number, type: string): Observable<StatisitcResponsePayload[]> {
    return this.http.get<StatisitcResponsePayload[]>(this.serverUrl + '/byid/' + wordSetId + '/' + type);
  }
}
