import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import { GameDialogPayload } from 'src/app/components/course/courses-shared/courses-shared.component';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { GameService } from 'src/app/components/course/course-game/pvp-game/game.service';


@Component({
  selector: 'app-contest-player-dialog',
  templateUrl: './contest-player-dialog.component.html',
  styleUrls: ['./contest-player-dialog.component.scss']
})
export class ContestPlayerDialogComponent implements OnInit {

  enemyNickname!: string;
  enemyExists: boolean = false;
  dateNow = new Date(0);
  private subscription!: Subscription;

  constructor(public dialogRef: MatDialogRef<ContestPlayerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { payload: GameDialogPayload, sharedWordSetId: number },
    private gameService: GameService, private socketService: SocketService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.socketService.closeInvitationDialog.subscribe(data => {
      if (data === true) {
        this.dialogRef.close();
      }
    })
    this.socketService.closeAcceptDialog.subscribe(data => {
      this.dialogRef.close();
      this.toastr.warning('Uzytkownik odzrzucil zaproszenie');
    });
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }


  closeDialog() {
    this.dialogRef.close(this.enemyNickname);
  }

  duelPlayer() {
    this.gameService.checkIfUserWithNicknameExists(this.enemyNickname).subscribe(data => {
      if (data === true) {
        this.enemyExists = true;
        this.socketService.sendInvitationToDuel(this.enemyNickname, this.data.sharedWordSetId);
        this.subscription = interval(1000)
          .subscribe(x => {
            if (this.dateNow.getSeconds() === 29) {
              this.socketService.deleteInvitation();
              this.dialogRef.close(this.data.payload);
            }
            this.dateNow = new Date(this.dateNow.setTime(this.dateNow.getTime() + 1000));
          });

      } else {
        this.dialogRef.close(this.data.payload);
      }

    }, error => {
      console.log(error);
    })
  }
}
