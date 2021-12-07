import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly serverUrl: string = 'http://localhost:8080/api/game';

  constructor(private http: HttpClient) { }

  checkIfUserWithNicknameExists(nickname: string): Observable<boolean> {
    return this.http.get<boolean>(this.serverUrl + "/" + nickname);
  }

}
