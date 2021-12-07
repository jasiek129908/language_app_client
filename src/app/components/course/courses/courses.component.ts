import { SharedCourseService } from './../shared-course.service';
import { RemoveShareWordCoursePayload } from './../../../shared/share-word-set-dialog/remove-share-word-course.payload';
import { ShareWordSetDialogComponent } from './../../../shared/share-word-set-dialog/share-word-set-dialog.component';
import { WordSetResponsePayLoad } from './allWordSetResponse.payload';
import { CourseService } from './../course.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { RemoveWordSetDialogComponent } from 'src/app/shared/remove-word-set-dialog/remove-word-set-dialog.component';
import ISO6391 from 'iso-639-1';
import { NavigationUtilityService } from 'src/app/nav/navigation-utility.service';
import { SortingType } from '../sorting-type.enum';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  gridByBreakpoint = {
    'Xl': 8,
    'Lg': 6,
    'Md': 4,
    'Sm': 3,
    'Xs': 2
  }

  pageNumber: number = 1;
  numberOfPages: number = 1;
  numberOfElemnts: number = this.gridByBreakpoint.Xl * 2;
  wordSet!: WordSetResponsePayLoad[];
  isWordSetsFromSearcher: boolean = false;
  sortingType: SortingType = SortingType.DATE_DESC;

  constructor(private mediaObserver: MediaObserver,
    private courseService: CourseService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private sharedCourseService: SharedCourseService,
    private searchingService: NavigationUtilityService) {
  }

  ngOnInit(): void {
    this.searchingService.clearFilterEmitter.emit(true);
    this.searchingService.searchEmitter.subscribe((data) => {
      if (this.searchingService.getSearchinText.length > 0) {
        this.isWordSetsFromSearcher = true;
        this.courseService
        .searchInWordSet(this.searchingService.getSearchinText, this.numberOfElemnts, this.pageNumber, this.sortingType,this.searchingService.getFilterLanguage)
        .subscribe((data) => {
          this.wordSet = data;
          this.pageNumber = 1;
          this.getNumberOfPages();
        });
      } else {
        this.isWordSetsFromSearcher = false;
        this.pageNumber = 1;
        this.getNumberOfPages();
        this.getNewPageWordSet(this.isWordSetsFromSearcher, this.sortingType);
      }
    });

    this.searchingService.sortEmitter.subscribe((sortType: SortingType) => {
      this.pageNumber = 1;
      this.sortingType = sortType;
      this.getNewPageWordSet(this.isWordSetsFromSearcher, this.sortingType);
    });

    this.searchingService.filterEmitter.subscribe(sortType => {
      this.pageNumber = 1;
      this.getNumberOfPages();
      this.getNewPageWordSet(this.isWordSetsFromSearcher, this.sortingType);
    });
  }

  ngAfterContentInit() {
    this.mediaObserver.asObservable().subscribe((change) => {
      let index: string = change[0].suffix;
      this.numberOfElemnts = (this.gridByBreakpoint as any)[index] * 2;
      this.pageNumber = 1;
      this.getNumberOfPages();
      this.getNewPageWordSet(this.isWordSetsFromSearcher, this.sortingType);
    });
  }

  openDeleteDialog(wordSetId: number) {
    const dialogRef = this.dialog.open(RemoveWordSetDialogComponent, {
      width: '350px',
      height: '170px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.courseService.removeWordSetById(wordSetId).subscribe(data => {
          this.ngAfterContentInit();
        });
      }
    });
  }

  shareCourse(wordSetId: number) {
    const dialogRef = this.dialog.open(ShareWordSetDialogComponent, {
      width: '350px',
      height: '170px',
      data: { wordSetId: wordSetId },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: RemoveShareWordCoursePayload) => {
      console.log(result);
      if (result.share !== null) {
        if (result.share === true) {
          this.sharedCourseService.shareCourse(wordSetId).subscribe(data => {
            this.ngAfterContentInit();
          }, error => {
            console.log(error);
          });
        }
      }
      if (result.deleteShare !== null) {
        if (result.deleteShare === true) {
          this.sharedCourseService.deleteShareCourse(wordSetId).subscribe(data => {
            this.ngAfterContentInit();
          }, error => {
            console.log(error);
          })
        }
      }
    });
  }

  getNumberOfPages() {
    if (this.isWordSetsFromSearcher) {
      this.courseService.getPageNumber(this.numberOfElemnts, this.searchingService.getSearchinText,this.searchingService.getFilterLanguage).subscribe(
        (data) => {
          this.numberOfPages = data;
        });
    } else {
      this.courseService.getPageNumber(this.numberOfElemnts, '',this.searchingService.getFilterLanguage).subscribe(
        (data) => {
          this.numberOfPages = data;
        });
    }
  }

  getNewPageWordSet(wordSetsFromSearcher: boolean, sort: SortingType) {
    if (wordSetsFromSearcher === false) {
      this.courseService
        .getPageWordSet(this.numberOfElemnts, this.pageNumber, sort,this.searchingService.getFilterLanguage)
        .subscribe((data) => {
          this.wordSet = data;
        });
    } else {
      this.courseService
      .searchInWordSet(this.searchingService.getSearchinText, this.numberOfElemnts, this.pageNumber, this.sortingType,this.searchingService.getFilterLanguage)
      .subscribe((data) => {
        this.wordSet = data;
      });
    }
  }

  previousPage() {
    if (this.pageNumber === 1) {
      return;
    }
    this.pageNumber--;
    this.getNewPageWordSet(this.isWordSetsFromSearcher, this.sortingType);
  }

  nextPage() {
    if (this.pageNumber === this.numberOfPages) {
      return;
    }
    this.pageNumber++;
    this.getNewPageWordSet(this.isWordSetsFromSearcher, this.sortingType);
  }

  showFullDescription(descrpiton: string) {
    let container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'description-container');

    let header = this.renderer.createElement('div');
    this.renderer.addClass(header, 'description-header');
    let hText = this.renderer.createText('Kliknij by zamknąć opis');
    this.renderer.appendChild(header, hText);

    let div = this.renderer.createElement('div');
    let divForText = this.renderer.createElement('div');
    let text = this.renderer.createText(descrpiton);
    this.renderer.addClass(div, 'full-description');

    this.renderer.listen(container, 'click', () => {
      this.renderer.removeChild(document.body, container);
    });

    this.renderer.appendChild(divForText, text);
    this.renderer.appendChild(div, header);
    this.renderer.appendChild(div, divForText);
    this.renderer.appendChild(container, div);
    this.renderer.appendChild(document.body, container);
  }

}
