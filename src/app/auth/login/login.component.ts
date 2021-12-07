import { LoginRequestPayload } from './loginRequest.payload';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginRequestPayLoad: LoginRequestPayload;
  isError: boolean = false;
  registerSuccessMessage: string = '';

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private router: Router, private socketService: SocketService) {
    this.loginRequestPayLoad = {
      email: '',
      password: ''
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login() {
    this.loginRequestPayLoad.email = this.loginForm.get('email')?.value;
    this.loginRequestPayLoad.password = this.loginForm.get('password')?.value;
    this.authService.login(this.loginRequestPayLoad).subscribe(data => {
      if (data) {
        this.socketService.connect();
        this.router.navigateByUrl('/courses');
      }
    }, error => {
      this.toastr.error('Logowanie nie powiodło się');
    })
  }

}
