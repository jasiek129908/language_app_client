import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { StatisitcRequestPayload, MistakesPerWord } from './../../course/course-game/statisticRequest.payload';
import { StatisticService } from './../../course/course-game/statistic.service';
import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StatisitcResponsePayload } from './statisticResponse.payload';

export interface SeriesData {
  name: string;
  value: number;
};

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class ChartsComponent implements OnInit, AfterViewInit {
  wordSetId!: number;
  serverGameType!: string;
  statistic!: StatisitcResponsePayload[];

  @ViewChild('myIdentifier')
  myIdentifier!: ElementRef;

  chartTimeData!: any[];
  chartMistakesData!: any[];
  hardestWords!: any[];

  view: [number, number] = [700, 300];

  xAxis: boolean = true;
  yAxis: boolean = true;

  yAxisLabel: string = 'Czas(s)';
  xAxisLabel: string = 'Podejścia';

  yMistakesLabel: string = 'Pomyłki';
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  animations: boolean = true;
  showGridLines: boolean = true;
  gradient: boolean = false;
  colorScheme = {
    domain: ['#704FC4', '#4B852C', '#B67A3D', '#5B6FC8', '#25706F']
  };
  schemeType: string = 'ordinal';


  constructor(private activatedRoute: ActivatedRoute, private statisticService: StatisticService) {
    this.activatedRoute.params.subscribe(data => {
      this.wordSetId = data.id;
      this.serverGameType = data.type;
    });
  }

  ngOnInit(): void {
    this.statisticService.getAllStatisitcByWordSetIdAndType(this.wordSetId, this.serverGameType).subscribe(data => {
      this.statistic = data;
      console.log(this.statistic);
      this.createChartDateForAttemptsToTime();
      this.createChartDateForMistakesPerAttempt();
    });
  }

  ngAfterViewInit(): void {
    if(this.myIdentifier.nativeElement.offsetWidth>600){
    this.view = [this.myIdentifier.nativeElement.offsetWidth / 1.50, 400];
    }else{
      this.view = [this.myIdentifier.nativeElement.offsetWidth / 1.1, 400];
    }
  }

  createChartDateForAttemptsToTime() {
    let series: Array<SeriesData> = new Array();
    let i = 1;
    for (let podejscie of this.statistic) {
      let temp: SeriesData = {
        name: i.toString(),
        value: podejscie.timeOfGameplay
      };
      i++;
      series.push(temp);
    }
    this.chartTimeData = series;
  }

  createChartDateForMistakesPerAttempt() {
    let series: Array<SeriesData> = new Array();
    let i = 1;
    let hardWords: Array<SeriesData> = new Array();
    for (let mistakePerWord of this.statistic[0].mistakesList) {
      hardWords.push({
        name: mistakePerWord.word,
        value: 0
      });
    }
    for (let podejscie of this.statistic) {
      let mistakesSum = 0;
      for (let mistakePerWord of podejscie.mistakesList) {
        hardWords.find(elem => elem.name === mistakePerWord.word)!.value += mistakePerWord.errorCounter;
        mistakesSum += mistakePerWord.errorCounter;
      }
      let temp: SeriesData = {
        name: i.toString(),
        value: mistakesSum
      };
      i++;
      series.push(temp);
    }
    this.hardestWords = hardWords;
    this.chartMistakesData = [{
      "name": "",
      "series": series
    }];
  }

  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }

}
