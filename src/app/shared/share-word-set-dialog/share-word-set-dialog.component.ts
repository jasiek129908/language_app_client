import { SharedCourseService } from './../../components/course/shared-course.service';
import { RemoveShareWordCoursePayload } from './remove-share-word-course.payload';
import { CourseService } from './../../components/course/course.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-share-word-set-dialog',
  templateUrl: './share-word-set-dialog.component.html',
  styleUrls: ['./share-word-set-dialog.component.scss']
})
export class ShareWordSetDialogComponent implements OnInit {

  sharedWordSet!: Object | null;

  constructor(public dialogRef: MatDialogRef<ShareWordSetDialogComponent>, private sharedCourseService: SharedCourseService
    , @Inject(MAT_DIALOG_DATA) public data: { wordSetId: number }) {
    this.sharedCourseService.getSharedWordSet(this.data.wordSetId).subscribe(data => {
      this.sharedWordSet = data;
    },error=>{
      this.sharedWordSet = null;
    })
  }

  ngOnInit(): void {
  }

  onYesClick() {
    let res: RemoveShareWordCoursePayload;
    if (this.sharedWordSet !== null) {
      res = {
        share: null,
        deleteShare: true
      }
    } else {
      res = {
        share: true,
        deleteShare: null
      }
    }
    this.dialogRef.close(res);
  }

  onNoClick() {
    let res: RemoveShareWordCoursePayload;
    if (this.sharedWordSet !== null) {
      res = {
        share: null,
        deleteShare: false
      }
    } else {
      res = {
        share: false,
        deleteShare: null
      }
    }
    this.dialogRef.close(res);
  }

}
