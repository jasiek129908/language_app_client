import { WordSetUpdateRequestPayLoad, WordUpdatePayload } from './wordSetUpdateRequest.payload';
import { AuthService } from './../../../auth/auth.service';
import { CourseService } from './../course.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WordSetResponsePayLoad } from '../courses/allWordSetResponse.payload';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WordPayload, WordSetRequestPayLoad } from '../new-course/wordSetRequest.payload';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  wordSetId!: number;
  wordSet!: WordSetResponsePayLoad;

  formGroup!: FormGroup;

  words: Array<WordUpdatePayload> = new Array();
  word: string = '';
  translation: string = '';
  wordDescription: string = '';

  dataSource = new MatTableDataSource<WordPayload>();
  constructor(private activatedRoute: ActivatedRoute, private courseService: CourseService, private router: Router
    , private authService: AuthService) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.wordSetId = params.id;
      console.log(this.wordSetId);
    });
    this.formGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      descriptionWordSet: new FormControl('', Validators.required)
    });

    this.courseService.getWordSetById(this.wordSetId).subscribe(data => {
      this.wordSet = data;
      for (let word of this.wordSet.wordList) {
        this.words.push(word);
      }
      let newDataSource = new MatTableDataSource<WordPayload>();
      for (let word of this.words) {
        newDataSource.data.push(word);
      }
      this.dataSource = newDataSource;

      this.formGroup.patchValue({
        title: this.wordSet.title,
        descriptionWordSet: this.wordSet.description
      });
    });
  }

  pushWordToListAndRefreshTable() {
    if (this.word.length > 0 && this.translation.length > 0) {
      this.words.push({
        id: null,
        word: this.word,
        translation: this.translation,
        description: this.wordDescription
      });
      this.word = '';
      this.translation = '';
      this.wordDescription = '';
      this.refreshTable();
    }
  }

  deleteFromWords(index: number) {
    this.words.splice(index, 1);
    this.refreshTable();
  }

  refreshTable() {
    let newDataSource = new MatTableDataSource<WordPayload>();
    for (let word of this.words) {
      newDataSource.data.push(word);
    }
    this.dataSource = newDataSource;
  }

  updateWordSet() {
    let updateSet: WordSetUpdateRequestPayLoad = {
      id: this.wordSet.id,
      toLanguage: this.wordSet.toLanguage,
      title: this.formGroup.get('title')?.value,
      description: this.formGroup.get('descriptionWordSet')?.value,
      email: this.authService.getUserEmail() || '',
      wordList: this.words
    }

    this.courseService.updateWordSet(updateSet).subscribe(data => {
      this.router.navigateByUrl("/courses");
    });
  }
}
