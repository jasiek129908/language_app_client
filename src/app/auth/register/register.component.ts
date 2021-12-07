import { PasswordValidator } from 'src/app/auth/register/password.validator';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RegisterRequestPayload } from './registerRequest.payload';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupRequestPayload!: RegisterRequestPayload;
  registerForm!: FormGroup;
  focusoutPasswordConfirmation: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.signupRequestPayload = {
      email: '',
      password: '',
      nickName: ''
    };

    this.registerForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      nickName: new FormControl('', Validators.required)
    });
    this.registerForm.setValidators(PasswordValidator);
  }

  register() {
    if (this.registerForm.valid) {
      this.prepareRequest();
      this.authService.register(this.signupRequestPayload).subscribe(data => {
        this.toastr.success('Pomyślnie zajerestrowany');
        this.router.navigate(['/login']);
      }, (res) => {
        this.toastr.error('Rejestracja nie powiodła się');
      });
    }
  }

  private prepareRequest() {
    this.signupRequestPayload.email = this.registerForm.get('email')?.value;
    this.signupRequestPayload.password = this.registerForm.get('password')?.value;
    this.signupRequestPayload.nickName = this.registerForm.get('nickName')?.value;
  }
}


