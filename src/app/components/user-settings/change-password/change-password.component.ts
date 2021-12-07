import { UserSettingsService } from './../user-settings.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/auth/register/password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;
  focusoutPasswordConfirmation: boolean = false;

  constructor(private userSettings: UserSettingsService) { }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });
    this.changePasswordForm.setValidators(PasswordValidator);
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.get('oldPassword')?.value;
      this.changePasswordForm.get('newPassword')?.value;
      let request = {
        oldPassword: this.changePasswordForm.get('oldPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value
      }
      this.userSettings.changePassword(request);
    }
  }

}
