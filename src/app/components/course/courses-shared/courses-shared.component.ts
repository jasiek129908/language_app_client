import { NavigationUtilityService } from '../../../nav/navigation-utility.service';
import { VoteService } from './vote.service';
import { ContestPlayerDialogComponent } from './../../../shared/contest-player-dialog/contest-player-dialog.component';
import { SharedCourseService } from './../shared-course.service';
import { SharedWordSetResponsePayload } from './sharedWordSetResponse.payload';
import { Component, OnInit, ViewChild, Renderer2, AfterContentInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserVotesToPostResponse } from './userVotes.payload';
import { SortingType } from '../sorting-type.enum';

export interface GameDialogPayload {
  nicknameExists: boolean;
  userAccepted: boolean;
}

@Component({
  selector: 'app-courses-shared',
  templateUrl: './courses-shared.component.html',
  styleUrls: ['./courses-shared.component.scss'],
})
export class CoursesSharedComponent implements OnInit, AfterContentInit {
  gridByBreakpoint = {
    'Xl': 8,
    'Lg': 6,
    'Md': 4,
    'Sm': 3,
    'Xs': 2
  }

  votes!: UserVotesToPostResponse[];
  pageNumber: number = 1;
  numberOfPages: number = 1;
  numberOfElemnts: number = this.gridByBreakpoint.Xl * 2;
  sharedWordSet!: SharedWordSetResponsePayload[];
  wordSetsFromSearcher: boolean = false;
  sortingType: SortingType = SortingType.LIKE_DESC;

  constructor(
    private mediaObserver: MediaObserver,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private sharedCourseService: SharedCourseService,
    private voteService: VoteService,
    private renderer: Renderer2,
    private searchingService: NavigationUtilityService
  ) { }

  ngOnInit(): void {
    this.searchingService.clearFilterEmitter.emit(true);
    this.searchingService.searchEmitter.subscribe((data) => {
      if (this.searchingService.getSearchinText.length > 0) {
        this.wordSetsFromSearcher = true;
        this.sharedCourseService
          .searchInWordSet(this.searchingService.getSearchinText, this.numberOfElemnts, this.pageNumber, this.sortingType, this.searchingService.getFilterLanguage)
          .subscribe((data) => {
            this.sharedWordSet = data;
            this.pageNumber = 1;
            this.getNumberOfPages();
          });
      } else {
        this.wordSetsFromSearcher = false;
        this.pageNumber = 1;
        this.getNumberOfPages();
        this.getNewPageSharedWordSet(this.wordSetsFromSearcher, this.sortingType);
      }
    });

    this.searchingService.sortEmitter.subscribe((sortType: SortingType) => {
      this.pageNumber = 1;
      this.sortingType = sortType;
      this.getNewPageSharedWordSet(this.wordSetsFromSearcher, this.sortingType);
    });

    this.searchingService.filterEmitter.subscribe(sortType => {
      this.pageNumber = 1;
      this.getNumberOfPages();
      this.getNewPageSharedWordSet(this.wordSetsFromSearcher, this.sortingType);
    });
  }

  ngAfterContentInit() {
    this.voteService.getUserSharedWordSetVotes().subscribe((data) => {
      this.votes = data;
    });

    this.mediaObserver.asObservable().subscribe((change) => {
      let index: string = change[0].suffix;
      this.numberOfElemnts = (this.gridByBreakpoint as any)[index] * 2;
      this.pageNumber = 1;
      this.getNumberOfPages();
      this.getNewPageSharedWordSet(this.wordSetsFromSearcher, this.sortingType);
    });
  }

  likeWordSet(sharedWordSetId: number) {
    this.sharedCourseService.likeSharedWordSet(sharedWordSetId).subscribe(
      () => {
        this.ngAfterContentInit();
      }
    );
  }

  dislikeWordSet(sharedWordSetId: number) {
    this.sharedCourseService.dislikeSharedWordSet(sharedWordSetId).subscribe(
      () => {
        this.ngAfterContentInit();
      }
    );
  }

  contestPlayerDialog(sharedWordSetId: number) {
    let payload: GameDialogPayload = {
      nicknameExists: false,
      userAccepted: false,
    };
    const dialogRef = this.dialog.open(ContestPlayerDialogComponent, {
      width: '400px',
      height: '255px',
      data: {
        payload,
        sharedWordSetId: sharedWordSetId,
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: GameDialogPayload) => {
      if (result.nicknameExists === false) {
        this.toastr.warning('Nie znalezniono uzytkownika');
      }
    });
  }

  getNumberOfPages() {
    if (this.wordSetsFromSearcher) {
      this.sharedCourseService.getPageNumber(this.numberOfElemnts, this.searchingService.getSearchinText, this.searchingService.getFilterLanguage).subscribe(
        (data) => {
          this.numberOfPages = data;
        });
    } else {
      this.sharedCourseService.getPageNumber(this.numberOfElemnts, '', this.searchingService.getFilterLanguage).subscribe(
        (data) => {
          this.numberOfPages = data;
        });
    }
  }

  getNewPageSharedWordSet(wordSetsFromSearcher: boolean, sort: SortingType) {
    if (wordSetsFromSearcher === false) {
      this.sharedCourseService
        .getPageSharedWordSet(this.numberOfElemnts, this.pageNumber, sort, this.searchingService.getFilterLanguage)
        .subscribe((data) => {
          this.sharedWordSet = data;
        });
    } else {
      this.sharedCourseService
        .searchInWordSet(this.searchingService.getSearchinText, this.numberOfElemnts, this.pageNumber, this.sortingType, this.searchingService.getFilterLanguage)
        .subscribe((data) => {
          this.sharedWordSet = data;
        });
    }
  }

  previousPage() {
    if (this.pageNumber === 1) {
      return;
    }
    this.pageNumber--;
    this.getNewPageSharedWordSet(this.wordSetsFromSearcher, this.sortingType);

  }

  nextPage() {
    if (this.pageNumber === this.numberOfPages) {
      return;
    }
    this.pageNumber++;
    this.getNewPageSharedWordSet(this.wordSetsFromSearcher, this.sortingType);

  }

  voteIsUp(sharedWordSetId: number): boolean | null {
    if (this.votes !== undefined) {
      let vote = this.votes.find(vote => vote.sharedWordSetId === sharedWordSetId);
      if (vote !== undefined) {
        return vote.isUp;
      } else {
        return null;
      }
    }
    return null;
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
