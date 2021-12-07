import { RegisterRequestPayload } from './register/registerRequest.payload';
import { RefreshTokenRequestPayload } from './refreshToken.payload';
import { LoginResponsePayload } from './login/loginResponse.payload';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginRequestPayload } from './login/loginRequest.payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output()
  loggedIn: EventEmitter<boolean> = new EventEmitter();

  private readonly serverUrl: string = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.http.post<LoginResponsePayload>(this.serverUrl + '/login', loginRequestPayload).pipe(
      map((data: LoginResponsePayload) => {
        localStorage.setItem('authenticationToken', data.authenticationToken);
        localStorage.setItem('email', data.email);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('expiresAt', data.expiresAt.toString());
        localStorage.setItem('nickName', data.nickName);

        this.loggedIn.emit(true);
        return true;
      }));

  }

  logout() {
    this.http.post(this.serverUrl + '/logout',
      { responseType: 'text' }).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });

    localStorage.removeItem('authenticationToken');
    localStorage.removeItem('email');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('nickName');
    this.loggedIn.emit(false);
  }

  register(signupRequestPayload: RegisterRequestPayload): Observable<any> {
    return this.http.post(this.serverUrl + '/register', signupRequestPayload, { responseType: 'text' });
  }

  refreshToken() {
    let payload: RefreshTokenRequestPayload = {
      refreshToken: this.getRefreshToken(),
      email: this.getUserEmail()
    }
    return this.http.post<LoginResponsePayload>(this.serverUrl + '/refreshToken', payload)
      .pipe(tap((response: LoginResponsePayload) => {
        localStorage.removeItem('authenticationToken');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('refreshToken');

        localStorage.setItem('authenticationToken',response.authenticationToken);
        localStorage.setItem('expiresAt', response.expiresAt.toString());
        localStorage.setItem('refreshToken', response.refreshToken.toString());
      }));
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authenticationToken') === null ? false : true;
  }

  getJwtToken() {
    return localStorage.getItem('authenticationToken');
  }

  getUserEmail() {
    return localStorage.getItem('email');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getNickName() {
    return localStorage.getItem('nickName');
  }
}
