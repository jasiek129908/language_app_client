import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../auth/auth.service';
import { Observable } from 'rxjs';
import { CourseService } from './../course.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { WordPayload, WordSetRequestPayLoad } from './wordSetRequest.payload';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  name: string;
}

export interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss'],
})
export class NewCourseComponent implements OnInit {

  myControl = new FormControl();
  myOptions: Array<Country> = new Array();
  filteredOptions!: Observable<Country[]>;

  availableLanguages?: Observable<string[]>;

  words: Array<WordPayload> = new Array();
  word!: string;
  title: string = '';
  translation!: string;
  wordDescription!: string;
  wordSetDescription: string = '';

  dataSource = new MatTableDataSource<WordPayload>();

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.courseService.getAvailableLanguagesCourses().subscribe((data) => {
      this.myOptions = data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this.filter(name) : this.myOptions.slice()))
      );
    });
  }

  displayFn(country: Country): string {
    return country && country.name ? country.name : '';
  }

  private filter(name: string): Country[] {
    const filterValue = name.toLowerCase();
    return this.myOptions.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  pushWordToListAndRefreshTable() {
    if (this.word.length > 0 && this.translation.length > 0) {
      this.words.push({
        word: this.word,
        translation: this.translation,
        description: this.wordDescription,
      });
      this.word = '';
      this.translation = '';
      this.wordDescription = '';
      let newDataSource = new MatTableDataSource<WordPayload>();
      for (let word of this.words) {
        newDataSource.data.push(word);
      }
      this.dataSource = newDataSource;
    }
  }

  saveWordSet() {
    if (this.newWordSetIsValid()) {
      let toLanguage;
      if (this.myControl.value.code === undefined) {
        let toLanguage = this.myOptions.find((elem) => elem.name.toLocaleLowerCase() === this.myControl.value.name);
      } else {
        toLanguage = this.myControl.value.name;
      }

      let wordSet: WordSetRequestPayLoad = {
        toLanguage: toLanguage,
        title: this.title,
        description: this.wordSetDescription,
        email: this.authService.getUserEmail() || 'null email',
        wordList: this.words,
      };

      this.courseService.saveWordSet(wordSet).subscribe(
        (data) => {
          this.router.navigate(['/courses']);
        },
        (error) => {
          console.log(error);
        });
    } else {
      this.toastr.warning('Nie popranie wypełniłeś formularz');
    }
  }


  newWordSetIsValid(): boolean {
    if(this.myControl.value.length ===0 ) return false;
    if (this.title.length === 0 || this.title.length >= 25) return false;
    if (this.wordSetDescription.length === 0) return false;
    if (this.words.length < 3) {
      this.toastr.warning('Zestaw musi się składać z conajmniej 3 słów');
      return false;
    }
    return true;
  }
}
