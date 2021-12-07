import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  mediaSuffix!: string;

  constructor(private router: Router,private mediaObserver: MediaObserver) {
    this.router.navigateByUrl('/user-settings/changePassword');
   }

  ngOnInit(): void {
    this.mediaObserver.asObservable().subscribe(data => {
      this.mediaSuffix = data[0].suffix;
    });
  }

}
