import { ToastRef, ToastrService } from 'ngx-toastr';
import { StatisticService } from './../statistic.service';
import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { timingSafeEqual } from 'crypto';
import { Subscription, interval } from 'rxjs';
import { CourseService } from '../../course.service';
import { WordSetResponsePayLoad, WordResponsePayload } from '../../courses/allWordSetResponse.payload';
import { MistakesPerWord, StatisitcRequestPayload } from '../statisticRequest.payload';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-scatter-game',
  templateUrl: './scatter-game.component.html',
  styleUrls: ['./scatter-game.component.scss']
})
export class ScatterGameComponent implements OnInit {

  private wordSetId!: number;
  wordSet!: WordSetResponsePayLoad;

  private subscription!: Subscription;
  dateNow = new Date(0);
  gameProgress: number = 0;
  mistakesCounter: number = 0;
  mistakesForCurrentWord: number = 0;
  mistakesPerWord: Array<MistakesPerWord> = new Array();

  correctWord!: WordResponsePayload;
  randomCharactersOfCurerntWord!: Array<string>;
  appendingWord: string = '';
  revealWord!: string[];

  listOfDisabledButtons: Array<MatButton> = Array();

  constructor(private activatedRoute: ActivatedRoute, private courseService: CourseService, private statisticService: StatisticService
    , private authService: AuthService,private router:Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.wordSetId = params.id;
    })
    this.courseService.getWordSetById(this.wordSetId).subscribe(data => {
      this.wordSet = data;
      this.subscription = interval(1000)
        .subscribe(x => {
          this.dateNow = new Date(this.dateNow.setTime(this.dateNow.getTime() + 1000));
        });
      this.correctWord = this.wordSet.wordList[this.gameProgress];
      this.generateList();
    });
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  generateList() {
    this.revealWord = [];
    for (let i = 0; i < this.correctWord.word.length; i++) {
      this.revealWord.push('');
    }
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
    let characterInWord: string = this.correctWord.word[this.appendingWord.length];

    if (character === characterInWord) {
      this.revealWord[this.revealWord.findIndex(elem => elem === '')] = character;
      this.appendingWord = this.appendingWord + character;
      button.disabled = true;
      this.listOfDisabledButtons.push(button);
      this.checkIfWordIsCorrect();
    } else {
      this.mistakesForCurrentWord++;
      this.mistakesCounter++;
    }
  }

  checkIfWordIsCorrect() {
    if (this.appendingWord === this.correctWord.word) {
      if (this.gameProgress + 1 === this.wordSet.wordList.length) {
        this.gameProgress++;
        let stats = this.prepareStatistic();
        this.statisticService.saveStatistic(stats).subscribe(data => {
          console.log(data);
        }, error => {
          console.log(error);
        });
        this.router.navigateByUrl("/courses");
        return;
      }
      this.mistakesPerWord.push({
        word: this.correctWord.translation,
        errorCounter: this.mistakesForCurrentWord
      })
      this.mistakesForCurrentWord = 0;
      this.gameProgress++;
      this.correctWord = this.wordSet.wordList[this.gameProgress];
      this.appendingWord = '';
      this.resetButtons();
      this.generateList();
    }
  }

  resetButtons() {
    for (let button of this.listOfDisabledButtons) {
      button.disabled = false;
    }
  }

  prepareStatistic(): StatisitcRequestPayload {
    let email = this.authService.getUserEmail();
    let stats: StatisitcRequestPayload = {
      gameType: 'SCATTER',
      timeOfGameplay: this.dateNow.getTime() / 1000,
      mistakesList: this.mistakesPerWord,
      email: email ? email : 'error',
      wordSetId: this.wordSetId
    }
    return stats;
  }
}
