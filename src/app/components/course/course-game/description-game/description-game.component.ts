import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../../auth/auth.service';
import { CourseService } from './../../course.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { Location } from '@angular/common';
import {
  WordSetResponsePayLoad,
  WordResponsePayload,
} from '../../courses/allWordSetResponse.payload';
import {
  MistakesPerWord,
  StatisitcRequestPayload,
} from '../statisticRequest.payload';
import { StatisticService } from '../statistic.service';

@Component({
  selector: 'app-description-game',
  templateUrl: './description-game.component.html',
  styleUrls: ['./description-game.component.scss'],
})
export class DescriptionGameComponent implements OnInit,OnDestroy {
  dateNow = new Date(0);
  private subscription!: Subscription;

  wordSetId!: number;
  wordSet!: WordSetResponsePayLoad;
  gameProgress: number = 0;

  correctWord!: WordResponsePayload;
  mistakesCounter: number = 0;
  mistakesForCurrentWord: number = 0;
  mistakesPerWord: Array<MistakesPerWord> = new Array();

  maxWordsInGame!: number;

  gameListOfDescription!: Array<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private statisticService: StatisticService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.wordSetId = params.id;
    });
    this.courseService.getWordSetById(this.wordSetId).subscribe((data) => {
      let count = 0;
      for (let i = 0; i < data.wordList.length; i++) {
        if (data.wordList[i].description !== null) count++;
      }
      console.log(count);
      if (count < 3) {
        this.toastr.error('Wybrany zestaw nie zawiera odpowiedniej ilości słów z opisem');
        this.location.back();
        return;
      }

      this.wordSet = data;
      this.subscription = interval(1000).subscribe((x) => {
        this.dateNow = new Date(
          this.dateNow.setTime(this.dateNow.getTime() + 1000)
        );
      });
      this.maxWordsInGame =
        this.wordSet.wordList.length < 9 ? this.wordSet.wordList.length : 9;
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
    let res = new Array<string>();
    let drawnIndexes = new Array<number>();
    while (drawnIndexes.length !== this.maxWordsInGame) {
      let index = Math.floor(Math.random() * this.wordSet.wordList.length);
      if (!drawnIndexes.includes(index)) {
        drawnIndexes.push(index);
      }
    }

    for (let i = 0; i < this.maxWordsInGame; i++) {
      res.push(this.wordSet.wordList[drawnIndexes[i]].description);
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

  checkWord(word: string) {
    if (word === this.correctWord.description) {
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
    let email = this.authService.getUserEmail();
    let stats: StatisitcRequestPayload = {
      gameType: 'DESCRIPTION',
      timeOfGameplay: this.dateNow.getTime() / 1000,
      mistakesList: this.mistakesPerWord,
      email: email ? email : 'error',
      wordSetId: this.wordSetId,
    };
    return stats;
  }
}
