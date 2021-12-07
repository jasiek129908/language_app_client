import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserSettingsService } from './../user-settings.service';
import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  oldEmail: string = '';
  newEmailGroup: FormGroup;

  constructor(private authService: AuthService, private userService: UserSettingsService) {
    let email = this.authService.getUserEmail()
    this.oldEmail = email ? email : 'error mail';

    this.newEmailGroup = new FormGroup({
      newEmail: new FormControl('', Validators.email)
    })
  }

  ngOnInit(): void {
  }

  changeEmail() {
    let newEmail:string  = this.newEmailGroup.get('newEmail')?.value;
    this.userService.changeEmail(newEmail ? newEmail : 'email error');
  }

}
