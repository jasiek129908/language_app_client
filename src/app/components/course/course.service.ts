import { Observable } from 'rxjs';
import { SharedWordSetResponsePayload } from './courses-shared/sharedWordSetResponse.payload';
import { AuthService } from './../../auth/auth.service';
import { WordSetRequestPayLoad } from './new-course/wordSetRequest.payload';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WordSetResponsePayLoad } from './courses/allWordSetResponse.payload';
import { WordSetUpdateRequestPayLoad } from './edit-course/wordSetUpdateRequest.payload';
import { Country } from './new-course/new-course.component';
import { SortingType } from './sorting-type.enum';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly serverUrl: string = 'http://localhost:8080/api/wordset';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAvailableLanguagesCourses(): Observable<Country[]> {
    return this.http.get<Country[]>(this.serverUrl + '/languages');
  }

  saveWordSet(wordSet: WordSetRequestPayLoad): Observable<WordSetRequestPayLoad> {
    return this.http.post<WordSetRequestPayLoad>(this.serverUrl , wordSet);
  }

  getAllUserWordSet(): Observable<WordSetResponsePayLoad[]> {
    let myParams = new HttpParams();
    let email = this.authService.getUserEmail();
    myParams = myParams.append('email', (email !== null ? email : 'email not found'));

    return this.http.get<WordSetResponsePayLoad[]>(this.serverUrl + '/userall', {
      params: myParams
    });
  }

  getWordSetById(wordSetId: number): Observable<WordSetResponsePayLoad> {
    return this.http.get<WordSetResponsePayLoad>(this.serverUrl + '/' + wordSetId);
  }

  removeWordSetById(wordSetId: number) {
    return this.http.delete(this.serverUrl + '/' + wordSetId);
  }

  updateWordSet(wordSet: WordSetUpdateRequestPayLoad) {
    return this.http.put(this.serverUrl + '/', wordSet);
  }


  getPageWordSet(pageSize: number, pageNumber: number, sortType: SortingType, filter: string[]): Observable<WordSetResponsePayLoad[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageNumber', pageNumber)
      .set('sortingType', SortingType[sortType])
      .set('filter', filter.join(', '));

    return this.http.get<WordSetResponsePayLoad[]>(this.serverUrl + '/page', { params: params });
  }

  getPageNumber(pageSize: number,searchText: string,filter: string[]): Observable<number> {
    let params = new HttpParams()
      .set('pageSize', pageSize)
      .set('text', searchText)
      .set('filter', filter.join(', '));

    return this.http.get<number>(this.serverUrl + '/allpagesize', { params: params });
  }

  searchInWordSet(text: string, pageSize: number, pageNumber: number, sortType: SortingType,filter: string[]): Observable<WordSetResponsePayLoad[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageNumber', pageNumber)
      .set('sortingType', SortingType[sortType])
      .set('filter', filter.join(', '));

    return this.http.get<WordSetResponsePayLoad[]>(this.serverUrl + '/search/' + text, { params: params });
  }
}
