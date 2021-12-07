import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CourseService } from '../course.service';
import { WordSetResponsePayLoad } from '../courses/allWordSetResponse.payload';
import { WordPayload } from '../new-course/wordSetRequest.payload';
import ISO6391 from 'iso-639-1';
import { escapeRegExp } from '@angular/compiler/src/util';

@Component({
  selector: 'app-course-display',
  templateUrl: './course-display.component.html',
  styleUrls: ['./course-display.component.scss']
})
export class CourseDisplayComponent implements OnInit {

  wordSet!: WordSetResponsePayLoad;
  wordSetId!: number;
  dataSource = new MatTableDataSource<WordPayload>();
  sliderType: string = 'Slajder';
  tableType: string = 'Tabelka';
  displayWordSetType: string = this.sliderType;
  indexOfSliderWord: number = 0;

  constructor(private courseService: CourseService
    , private authService: AuthService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.wordSetId = params.id;
    })

    this.courseService.getWordSetById(this.wordSetId).subscribe(data => {
      this.wordSet = data;

      let newDataSource = new MatTableDataSource<WordPayload>();
      for (let word of this.wordSet.wordList) {
        newDataSource.data.push(word);
      }
      this.dataSource = newDataSource;
    });
  }

  changeDisplayMode() {
    if (this.displayWordSetType === this.sliderType) {
      this.displayWordSetType = this.tableType;
    } else if (this.displayWordSetType === this.tableType) {
      this.displayWordSetType = this.sliderType;
    }
  }

  nextWord() {
    if (this.indexOfSliderWord + 1 < this.dataSource.data.length) {
      this.indexOfSliderWord++;
    } else {
      this.indexOfSliderWord = 0;
    }
  }

  previousWord() {
    if (this.indexOfSliderWord - 1 < 0) {
      this.indexOfSliderWord = this.dataSource.data.length - 1;
    } else {
      this.indexOfSliderWord--;
    }
  }
}
