import { UserSettingsService } from './../user-settings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-nickname',
  templateUrl: './change-nickname.component.html',
  styleUrls: ['./change-nickname.component.scss']
})
export class ChangeNicknameComponent implements OnInit {

  newNickname: string = '';
  oldNickname: string;
  constructor(private userService: UserSettingsService, private authService: AuthService) {
    this.oldNickname = this.authService.getNickName() as string;
  }

  ngOnInit(): void {
  }

  changeNickname() {
    this.userService.changeNickname(this.newNickname);
  }
}
