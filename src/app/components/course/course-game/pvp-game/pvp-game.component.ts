import { SharedCourseService } from './../../shared-course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SharedWordSetResponsePayload } from '../../courses-shared/sharedWordSetResponse.payload';
import { WordResponsePayload } from '../../courses/allWordSetResponse.payload';
import { MatButton } from '@angular/material/button';
import { DuelNextWordGameType, SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-pvp-game',
  templateUrl: './pvp-game.component.html',
  styleUrls: ['./pvp-game.component.scss'],
})
export class PvpGameComponent implements OnInit,OnDestroy {
  dateNow = new Date(0);
  private subscription!: Subscription;
  mistakesCounter: number = 0;
  gameProgress: number = 0;
  currentGameType!: string;

  enemyTaskDone: Array<boolean> = new Array();
  sharedWordSetId!: number;
  sharedWordSet!: SharedWordSetResponsePayload;

  maxWordsInGame!: number;
  correctWord!: WordResponsePayload;
  //description
  gameListOfDescription!: Array<string>;
  //scatter
  appendingWord: string = '';
  randomCharactersOfCurerntWord!: Array<string>;
  listOfDisabledButtons: Array<MatButton> = Array();
  revealWord!: string[];
  //transaltion
  gameListOfTranslation!: Array<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedCourseService: SharedCourseService,
    private router: Router,
    private socketService: SocketService
  ) {
    let payload = this.activatedRoute.snapshot.paramMap.get('payload');
    let temp = payload ? payload : 'error';
    let res: DuelNextWordGameType = JSON.parse(temp);

    this.sharedWordSetId = res.sharedWordSetId;
    this.sharedCourseService
      .getSharedWordSet(this.sharedWordSetId)
      .subscribe((data) => {
        this.sharedWordSet = data;
        this.initTaskDone(this.sharedWordSet.wordSet.wordList.length);
        this.maxWordsInGame =
          this.sharedWordSet.wordSet.wordList.length < 9
            ? this.sharedWordSet.wordSet.wordList.length
            : 9;
        this.currentGameType = res.gameType;
        this.setCorrectWord(res.word);
        switch (this.currentGameType) {
          case 'SCATTER': {
            this.generateGameForScatterType();
            break;
          }
          case 'DESCRIPTION': {
            this.generateGameForDiscriptionType();
            break;
          }
          case 'TRANSLATION': {
            this.generateGameForTranslationType();
            break;
          }
          default: {
            console.log('nie powinno mnie tu byc');
            break;
          }
        }
      });
      this.subscription = interval(1000).subscribe((x) => {
        this.dateNow = new Date(
          this.dateNow.setTime(this.dateNow.getTime() + 1000)
        );
      });
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.socketService.enemyProgress.subscribe((data) => {
      let index = this.enemyTaskDone.findIndex((elem) => elem === false);
      this.enemyTaskDone[index] = true;
    });

    this.socketService.updateGameWord.subscribe((data) => {
      let newWord =
        this.socketService.listDuelNextWordGameType[this.gameProgress];
      this.setCorrectWord(newWord.word);
      this.currentGameType = newWord.gameType;
      this.resetButtons();
      this.generateGame();
    });
  }

  generateGame() {
    switch (this.currentGameType) {
      case 'SCATTER': {
        this.generateGameForScatterType();
        break;
      }
      case 'DESCRIPTION': {
        this.generateGameForDiscriptionType();
        break;
      }
      case 'TRANSLATION': {
        this.generateGameForTranslationType();
        break;
      }
      default: {
        console.log('shouldnt be here game type');
        break;
      }
    }
  }

  setCorrectWord(wordParam: string) {
    for (let word of this.sharedWordSet.wordSet.wordList) {
      if (word.word === wordParam) {
        this.correctWord = word;
        return;
      }
    }
  }

  initTaskDone(number: number) {
    for (let i = 0; i < number; i++) {
      this.enemyTaskDone.push(false);
    }
  }

  generateGameForDiscriptionType() {
    this.gameListOfDescription = new Array();
    let res = new Array<string>();
    let drawnIndexes = new Array<number>();
    while (drawnIndexes.length !== this.maxWordsInGame) {
      let index = Math.floor(
        Math.random() * this.sharedWordSet.wordSet.wordList.length
      );
      if (!drawnIndexes.includes(index)) {
        drawnIndexes.push(index);
      }
    }

    for (let i = 0; i < this.maxWordsInGame; i++) {
      res.push(
        this.sharedWordSet.wordSet.wordList[drawnIndexes[i]].description
      );
    }
    let jest = false;
    for (let item of res) {
      if (item === this.correctWord.description) {
        jest = true;
        break;
      }
    }
    if (jest === false) {
      res[Math.floor(Math.random() * this.maxWordsInGame)] =
        this.correctWord.description;
    }
    this.gameListOfDescription = res;
  }

  checkDescription(word: string) {
    if (word === this.correctWord.description) {
      this.gameProgress++;
      if (this.gameProgress === this.sharedWordSet.wordSet.wordList.length) {
        this.socketService.sendGameWinner();
      } else {
        this.socketService.sendProgress();
      }
    } else {
      this.mistakesCounter++;
    }
  }

  generateGameForScatterType() {
    this.revealWord = [];
    for (let i = 0; i < this.correctWord.word.length; i++) {
      this.revealWord.push('');
    }
    this.randomCharactersOfCurerntWord = new Array();
    let res = new Array<string>();
    let stringToScatter = this.correctWord.word;

    let drawnIndexes = new Array<number>();
    while (stringToScatter.length !== drawnIndexes.length) {
      let index = Math.floor(Math.random() * stringToScatter.length);
      if (!drawnIndexes.includes(index)) {
        drawnIndexes.push(index);
      }
    }

    for (let i = 0; i < stringToScatter.length; i++) {
      res.push(stringToScatter[drawnIndexes[i]]);
    }

    this.randomCharactersOfCurerntWord = res;
  }

  checkCharacter(event: any, button: MatButton) {
    let character: string = event.currentTarget.innerText;
    let characterInWord: string =
      this.correctWord.word[this.appendingWord.length];

    if (character === characterInWord) {
      this.revealWord[this.revealWord.findIndex(elem => elem === '')] = character;
      this.listOfDisabledButtons.push(button);
      this.appendingWord = this.appendingWord + character;
      button.disabled = true;
      this.checkIfWordIsCorrect();
    } else {
      this.mistakesCounter++;
    }
  }

  checkIfWordIsCorrect() {
    if (this.appendingWord === this.correctWord.word) {
      this.appendingWord = '';
      this.gameProgress++;
      if (this.gameProgress === this.sharedWordSet.wordSet.wordList.length) {
        this.socketService.sendGameWinner();
      } else {
        this.socketService.sendProgress();
      }
    }
  }

  resetButtons() {
    for (let button of this.listOfDisabledButtons) {
      button.disabled = false;
    }
    this.listOfDisabledButtons = new Array();
  }

  generateGameForTranslationType() {
    this.gameListOfTranslation = new Array();
    let res = new Array<string>();
    let drawnIndexes = new Array<number>();
    while (drawnIndexes.length !== this.maxWordsInGame) {
      let index = Math.floor(
        Math.random() * this.sharedWordSet.wordSet.wordList.length
      );
      if (!drawnIndexes.includes(index)) {
        drawnIndexes.push(index);
      }
    }

    for (let i = 0; i < this.maxWordsInGame; i++) {
      res.push(this.sharedWordSet.wordSet.wordList[drawnIndexes[i]].word);
    }

    let jest = false;
    for (let item of res) {
      if (item === this.correctWord.word) {
        jest = true;
        break;
      }
    }
    if (jest === false) {
      res[Math.floor(Math.random() * this.maxWordsInGame)] =
        this.correctWord.word;
    }
    this.gameListOfTranslation = res;
  }

  checkTransaltion(word: string) {
    if (word === this.correctWord.word) {
      this.gameProgress++;
      if (this.gameProgress === this.sharedWordSet.wordSet.wordList.length) {
        this.socketService.sendGameWinner();
      } else {
        this.socketService.sendProgress();
      }
    } else {
      this.mistakesCounter++;
    }
  }
}
