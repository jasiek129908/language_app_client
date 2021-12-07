import { filter, map, startWith } from 'rxjs/operators';
import { CourseService } from './../components/course/course.service';
import { NavigationUtilityService } from './navigation-utility.service';
import { MediaObserver } from '@angular/flex-layout';
import { UserSettingsService } from './../components/user-settings/user-settings.service';
import { AuthService } from './../auth/auth.service';
import { AfterContentInit, Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Country } from '../components/course/new-course/new-course.component';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @ViewChild('snav')
  sideNav!: MatSidenav;
  @ViewChild('filter')
  filterDiv!: ElementRef;

  mediaSuffix!: string;
  innerWidth: number = window.innerWidth;

  userNick!: string;
  isLoggedIn!: boolean;

  searchingText: string = '';
  defaultValue: string = 'Data malejąco';
  filterOpen: boolean = false;
  countryResponse!: Array<Country>;
  myOptions!: Array<Country>;
  languagesToFilter: Array<string> = new Array();

  filteredOptions!: Observable<Country[]>;
  myControl = new FormControl();

  constructor(private authService: AuthService,
    private router: Router,
    private courseService: CourseService,
    private userSettingsService: UserSettingsService,
    private mediaObserver: MediaObserver,
    private searchingService: NavigationUtilityService,
    private navUtilService: NavigationUtilityService,
    private renderer: Renderer2) {
    // this.renderer.listen('window', 'click', e => {
    //   console.log(isDescendant(document.querySelector('.filter'),e.target));
    //   if (!isDescendant(document.querySelector('.filter'),e.target) && !document.querySelector('.filterButton')?.contains(e.target)) {
    //     this.filterOpen = false;
    //     this.filterDiv.nativeElement.style.visibility = 'hidden';
    //     this.navUtilService.setFilterLanguage = this.languagesToFilter;
    //   }
    // });
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => this.sideNav.close());

    this.mediaObserver.asObservable().subscribe(data => {
      this.mediaSuffix = data[0].suffix;
      console.log(this.mediaSuffix);
    });

    if (this.authService.getNickName() === null) {
      this.isLoggedIn = false;
    } else {
      let nick = this.authService.getNickName();
      this.userNick = nick ? nick : 'error';
      this.isLoggedIn = true;
    }

    this.userSettingsService.nickChanged.subscribe(data => {
      if (data === true) {
        let nick = this.authService.getNickName();
        console.log('nick: ' + nick);
        this.userNick = nick ? nick : 'error';
      }
    });

    this.authService.loggedIn.subscribe((data: boolean) => {
      if (data == true) {
        let nick = this.authService.getNickName();
        this.userNick = nick ? nick : 'error';
        this.isLoggedIn = true;
      }
      if (data == false) {
        this.userNick = '';
        this.isLoggedIn = false;
      }
    });

    this.courseService.getAvailableLanguagesCourses().subscribe((data) => {
      this.countryResponse = data;
      this.myOptions = data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((name) => (name ? this.filter(name) : this.myOptions.slice()))
      );
    });

    this.navUtilService.clearFilterEmitter.subscribe(data => {
      this.myOptions = this.countryResponse;
      this.navUtilService.setFilterLanguage = [];
      this.languagesToFilter = new Array();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  private filter(name: string): Country[] {
    const filterValue = name.toLowerCase();
    return this.myOptions.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

  isActive(): boolean {
    return this.router.url.includes('user-settings');
  }

  shouldDisplaySearcherAndFilters(): boolean {
    return this.router.url.includes('courses') || this.router.url.includes('shared-courses');
  }

  getSortingOptions(): string[] {
    if (this.router.url.includes('shared-courses')) {
      return [
        'Data rosnąco',
        'Data malejąco',
        'Liczba polubień rosnąco',
        'Liczba polubień malejąco'
      ];
    } else {
      return [
        'Data rosnąco',
        'Data malejąco'
      ];
    }
  }

  changeSearch(event: any) {
    this.searchingText = (event.target as HTMLInputElement).value;
    this.searchingService.setSearchinText = this.searchingText;
  }

  sortingChanged(sortingType: string) {
    this.searchingService.setSortingText = sortingType;
  }

  openFilterWindow() {
    if (!this.filterOpen) {
      this.filterOpen = true;
      this.filterDiv.nativeElement.style.visibility = 'visible';
    } else {
      this.filterOpen = false;
      this.filterDiv.nativeElement.style.visibility = 'hidden';
      this.navUtilService.setFilterLanguage = this.languagesToFilter;
    }
  }

  addFilter(language: string) {
    this.languagesToFilter.push(language);
    this.myOptions = this.myOptions.filter(country => country.name !== language);
    this.myControl.reset(this.myControl.value);
    this.myControl.setValue('');
  }

  removeFilter(language: string) {
    this.languagesToFilter = this.languagesToFilter.filter(lan => lan !== language);
    let item = this.countryResponse.find(country => country.name === language)
    if (item !== undefined) {
      this.myOptions.push(item);
    }
  }
}
