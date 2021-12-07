import { Location } from '@angular/common';
import { AuthService } from './../../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import {
  WordResponsePayload,
  WordSetResponsePayLoad,
} from '../../courses/allWordSetResponse.payload';
import { CourseService } from '../../course.service';
import { StatisticService } from '../statistic.service';
import {
  MistakesPerWord,
  StatisitcRequestPayload,
} from '../statisticRequest.payload';

@Component({
  selector: 'app-translation-game',
  templateUrl: './translation-game.component.html',
  styleUrls: ['./translation-game.component.scss'],
})
export class TranslationGameComponent implements OnInit, OnDestroy {
  dateNow = new Date(0);
  private subscription!: Subscription;

  wordSetId!: number;
  wordSet!: WordSetResponsePayLoad;
  gameProgress: number = 0;

  correctWord!: WordResponsePayload;
  mistakesCounter: number = 0;
  maxWordsInGame!: number;

  mistakesForCurrentWord: number = 0;
  mistakesPerWord: Array<MistakesPerWord> = new Array();

  gameListOfTranslation!: Array<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private statisticService: StatisticService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.wordSetId = params.id;
    });
    this.courseService.getWordSetById(this.wordSetId).subscribe((data) => {
      this.wordSet = data;
      this.maxWordsInGame = this.wordSet.wordList.length < 9 ? this.wordSet.wordList.length : 9;
      this.correctWord = this.wordSet.wordList[this.gameProgress];
      this.generateList();
      this.subscription = interval(1000).subscribe((x) => {
        this.dateNow = new Date(
          this.dateNow.setTime(this.dateNow.getTime() + 1000)
        );
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  generateList() {
    let res = new Array<string>();
    let drawnIndexes = new Array<number>();
    while (drawnIndexes.length !== this.maxWordsInGame) {
      let index = Math.floor(Math.random() * this.wordSet.wordList.length);
      if (!drawnIndexes.includes(index)) {
        drawnIndexes.push(index);
      }
    }

    for (let i = 0; i < this.maxWordsInGame; i++) {
      res.push(this.wordSet.wordList[drawnIndexes[i]].word);
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

  checkWord(word: string) {
    if (word === this.correctWord.word) {
      if (this.gameProgress + 1 === this.wordSet.wordList.length) {
        this.gameProgress++;
        let stats = this.prepareStatistic();
        this.statisticService.saveStatistic(stats).subscribe(
          (data) => {
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
        this.router.navigateByUrl("/courses");
        return;
      }
      this.mistakesPerWord.push({
        word: this.correctWord.translation,
        errorCounter: this.mistakesForCurrentWord,
      });
      this.mistakesForCurrentWord = 0;
      this.gameProgress++;
      this.correctWord = this.wordSet.wordList[this.gameProgress];
      this.generateList();
    } else {
      this.mistakesForCurrentWord++;
      this.mistakesCounter++;
    }
  }

  prepareStatistic(): StatisitcRequestPayload {
    console.log(this, this.mistakesPerWord);
    let email = this.authService.getUserEmail();
    let stats: StatisitcRequestPayload = {
      gameType: 'TRANSLATION',
      timeOfGameplay: this.dateNow.getTime() / 1000,
      mistakesList: this.mistakesPerWord,
      email: email ? email : 'error',
      wordSetId: this.wordSetId,
    };
    return stats;
  }
}
