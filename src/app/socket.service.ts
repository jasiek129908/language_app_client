import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Injectable, Output, EventEmitter } from '@angular/core';
import * as Stomp from 'stompjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AcceptDuelDialogComponent } from './shared/accept-duel-dialog/accept-duel-dialog.component';
import { AuthService } from './auth/auth.service';

export interface DuelInvitationResponse {
  nickname: string;
  sharedWordSetId: number;
}

export interface DuelNextWordGameType {
  sharedWordSetId: number;
  word: string;
  gameType: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  @Output()
  closeAcceptDialog: EventEmitter<boolean> = new EventEmitter();
  @Output()
  closeInvitationDialog: EventEmitter<boolean> = new EventEmitter();
  @Output()
  enemyProgress:EventEmitter<boolean> = new EventEmitter();
  @Output()
  updateGameWord:EventEmitter<boolean> = new EventEmitter();

  listDuelNextWordGameType!:Array<DuelNextWordGameType>;

  ws: any;
  dialogDuelRef!: MatDialogRef<AcceptDuelDialogComponent, any>;

  constructor(public dialog: MatDialog,private authService: AuthService,private router: Router
    ,private toastr:ToastrService) {
    if (this.authService.isLoggedIn()) {
      this.connect();
    }
  }

  connect() {
    this.listDuelNextWordGameType = new Array();
    let socket = new WebSocket('ws://localhost:8080/duel');
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect(
      { username: this.authService.getNickName() },
      function (frame: any) {
        that.ws.send('/app/register', {}, that.authService.getNickName());

        that.ws.subscribe('/errors', function (message: any) {
          alert('Error ' + message.body);
        });

        that.ws.subscribe(
          '/user/queue/private/rejected',
          function (message: any) {
            that.closeAcceptDialog.emit(true);
          }
        );

        that.ws.subscribe('/user/queue/private', function (message: any) {
          console.log('tylko do mnie: ' + message);
        });

        that.ws.subscribe(
          '/user/queue/private/remove',
          function (message: any) {
            that.dialogDuelRef.close();
          }
        );

        that.ws.subscribe(
          '/user/queue/private/acceptDuel',
          function (frame: any) {
            let response: DuelInvitationResponse = JSON.parse(frame.body);
            that.dialogDuelRef = that.dialog.open(AcceptDuelDialogComponent, {
              width: '400px',
              height: '220px',
              data: { duelData: response },
              autoFocus: false
            });

            that.dialogDuelRef.afterClosed().subscribe((data) => {
              that.sendInvitationDuelResult(data);
            });
          }
        );

        that.ws.subscribe(
          '/user/queue/private/gameStarted',
          function (message: any) {
            that.closeInvitationDialog.emit(true);
            let response: DuelNextWordGameType = JSON.parse(message.body);
            that.listDuelNextWordGameType.push(response);
            that.router.navigate(['/pvp', {payload: JSON.stringify(response).toString()}]);
          }
        );

        that.ws.subscribe(
          '/user/queue/private/gameProgress',
          function (message: any) {
            that.enemyProgress.emit(true);
          }
        );

        that.ws.subscribe(
          '/user/queue/private/nextWord',
          function (message: any) {
            let response: DuelNextWordGameType = JSON.parse(message.body);
            that.listDuelNextWordGameType.push(response);
            that.updateGameWord.emit(true);
          }
        );

        that.ws.subscribe(
          '/user/queue/private/winner',
          function (message: any) {
            that.listDuelNextWordGameType = new Array();
            let response: boolean = JSON.parse(message.body);
            if(response === true){
              that.toastr.success('Wygrales!');
            }else{
              that.toastr.warning('Przegrales!');
            }
            that.router.navigate(['/shared-courses']);
          }
        );

      },
      function (error: string) {
        alert('Socket error ' + error);
      }
    );
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.close();
    }
  }

  sendGameWinner(){
    console.log('wyslalem ze wyglramemem')
    this.ws.send('/app/game/winner', {});
  }

  sendProgress(){
    this.ws.send('/app/game/progress', {});
  }

  sendInvitationToDuel(nickname: string, sharedWordSetId: number) {
    let data = JSON.stringify({
      nickname: nickname,
      sharedWordSetId: sharedWordSetId,
    });
    this.ws.send('/app/toUser/invitation', {}, data);
  }

  sendInvitationDuelResult(accepted: boolean) {
    this.ws.send('/app/invitation/accept', {}, accepted);
  }

  deleteInvitation() {
    this.ws.send('/app/invitation/remove', {});
  }

  sendToUser() {
    let data = JSON.stringify({
      toUser: 'this.userName',
      text: 'this.text',
    });
    this.ws.send('/app/toUser', {}, data);
  }
}
