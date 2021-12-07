import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-remove-word-set-dialog',
  templateUrl: './remove-word-set-dialog.component.html',
  styleUrls: ['./remove-word-set-dialog.component.scss']
})
export class RemoveWordSetDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveWordSetDialogComponent>) { }


  onRemoveClick() {
    this.dialogRef.close(true);
  }
  onPersistClick() {
    this.dialogRef.close(false);
  }
  ngOnInit(): void {
  }

}
