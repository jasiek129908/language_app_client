import ISO6391 from 'iso-639-1';
import { SharedCourseService } from './../../components/course/shared-course.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DuelInvitationResponse } from 'src/app/socket.service';
import { SharedWordSetResponsePayload } from 'src/app/components/course/courses-shared/sharedWordSetResponse.payload';

@Component({
  selector: 'app-accept-duel-dialog',
  templateUrl: './accept-duel-dialog.component.html',
  styleUrls: ['./accept-duel-dialog.component.scss']
})
export class AcceptDuelDialogComponent implements OnInit {

  sharedWordSet!: SharedWordSetResponsePayload;

  constructor(private sharedCourseService: SharedCourseService, public dialogRef: MatDialogRef<AcceptDuelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {duelData:DuelInvitationResponse}) { }

  ngOnInit(): void {
    this.sharedCourseService.getSharedWordSet(this.data.duelData.sharedWordSetId).subscribe(data => {
      this.sharedWordSet = data;
    });
  }

  accept() {
    this.dialogRef.close(true);
  }

  reject() {
    this.dialogRef.close(false);
  }
}
