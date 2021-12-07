import { Component, OnInit, ViewChild } from '@angular/core';
import { MatGridList } from '@angular/material/grid-list';
import { MediaObserver } from '@angular/flex-layout';
import { Router, ActivatedRoute } from '@angular/router';
import { WordSetResponsePayLoad } from '../../courses/allWordSetResponse.payload';

@Component({
  selector: 'app-choose-game-type',
  templateUrl: './choose-game-type.component.html',
  styleUrls: ['./choose-game-type.component.scss']
})
export class ChooseGameTypeComponent implements OnInit {

  wordSetId!: number;

  constructor(private mediaObserver: MediaObserver, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.wordSetId = params.id;
    })
  }

  ngOnInit(): void {
  }
}
