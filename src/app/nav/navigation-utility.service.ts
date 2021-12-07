import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationUtilityService {

  private searchingText: string;
  private sortingText: string;
  private filterLanguage:Array<string>;

  @Output()
  searchEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output()
  sortEmitter: EventEmitter<string> = new EventEmitter();
  @Output()
  filterEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output()
  clearFilterEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.searchingText = '';
    this.sortingText = '';
    this.filterLanguage = new Array();
  }

  get getSearchinText() {
    return this.searchingText;
  }

  get getFilterLanguage() {
    return this.filterLanguage;
  }

  set setSearchinText(newValue: string) {
    this.searchingText = newValue;
    this.searchEmitter.emit(true);
  }

  set setSortingText(newValue: string) {
    this.sortingText = newValue;
    this.sortEmitter.emit(this.sortingText);
  }

  set setFilterLanguage(newValue: string[]) {
    this.filterLanguage = newValue;
    this.filterEmitter.emit(false);
  }
}
