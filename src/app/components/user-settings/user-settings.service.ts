import { ChangeEmailResponsePaylad } from './change-email/changeEmailResponse.payload';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';

export interface NicknameChangeResponse{
  nickname:string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  @Output()
  nickChanged: EventEmitter<boolean> = new EventEmitter();

  private readonly serverUrl: string = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  changeNickname(newNickName: string) {
    const myParams = new HttpParams()
      .set('nick', newNickName);

    this.http.post<NicknameChangeResponse>(this.serverUrl + '/nick', myParams).subscribe((data:NicknameChangeResponse) => {
      localStorage.removeItem('nickName');
      localStorage.setItem('nickName',data.nickname);
      this.nickChanged.emit(true);
    },error=>{
      console.log(error);
    });
  }

  changePassword(payload: object) {
    this.http.post(this.serverUrl + '/password', payload).subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    })
  }

  changeEmail(email: string) {
    const myParams = new HttpParams()
      .set('email', email);

    this.http.post<ChangeEmailResponsePaylad>(this.serverUrl + '/email', myParams).subscribe((data: ChangeEmailResponsePaylad) => {
      console.log('zmieniels email');
      this.changeEmailInLocalStorageToNewOne(data.email);
    }, error => {
      console.log(error);
    })
  }

  changeEmailInLocalStorageToNewOne(newEmail: string) {
    localStorage.removeItem('email');
    localStorage.setItem('email', newEmail);
  }

}

