import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserVotesToPostResponse } from './userVotes.payload';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  private readonly serverUrl: string = 'http://localhost:8080/api/votes';

  constructor(private http: HttpClient) {}

  getUserSharedWordSetVotes(): Observable<UserVotesToPostResponse[]> {
    return this.http.get<UserVotesToPostResponse[]>(this.serverUrl);
  }
}
