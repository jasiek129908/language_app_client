import { StatisticService } from './../../course/course-game/statistic.service';
import { Component, OnInit } from '@angular/core';
import { WordSetResponsePayLoad } from '../../course/courses/allWordSetResponse.payload';
import ISO6391 from 'iso-639-1';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  allUserWordSet!: WordSetResponsePayLoad[];
  gameType: string = 'Rozsypanka';
  serverType: string = 'SCATTER';
  gameTypes = [
    {
      type: 'Rozsypanka',
      serverType: 'SCATTER'
    },
    {
      type: 'Tłumaczenie',
      serverType: 'TRANSLATION'
    },
    {
      type: 'Opis',
      serverType: 'DESCRIPTION'
    },
  ];

  constructor(private statisticService: StatisticService) {
  }

  ngOnInit(): void {
    this.fetchWordSetWithProperType();
  }

  fetchWordSetWithProperType() {
    let temp = this.gameTypes.find(elem => elem.type === this.gameType)?.serverType;
    this.serverType = temp ? temp : 'error';
    this.statisticService.getAllUserWordSetWithStatistic(this.serverType).subscribe((data: WordSetResponsePayLoad[]) => {
      this.allUserWordSet = data;
    });
  }

}
