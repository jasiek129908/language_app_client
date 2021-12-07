import { filter } from 'rxjs/operators';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SharedWordSetResponsePayload } from "./courses-shared/sharedWordSetResponse.payload";
import { SortingType } from "./sorting-type.enum";

@Injectable({
  providedIn: 'root'
})
export class SharedCourseService {

  private readonly serverUrl: string = 'http://localhost:8080/api/sharedwordset';

  constructor(private http: HttpClient) { }

  getPageSharedWordSet(pageSize: number, pageNumber: number, sortType: SortingType, filter: string[]): Observable<SharedWordSetResponsePayload[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageNumber', pageNumber)
      .set('sortingType', SortingType[sortType])
      .set('filter', filter.join(', '));

      return this.http.get<SharedWordSetResponsePayload[]>(this.serverUrl + '/page', { params: params });
  }

  getPageNumber(pageSize: number, searchText: string,filter: string[]): Observable<number> {
    let params = new HttpParams()
      .set('pageSize', pageSize)
      .set('text', searchText)
      .set('filter', filter.join(', '));

    return this.http.get<number>(this.serverUrl + '/allpagesize', { params: params });
  }

  shareCourse(wordSetId: number) {
    return this.http.post(this.serverUrl + 'wordset/share', wordSetId);
  }

  getSharedWordSet(wordSetId: number): Observable<SharedWordSetResponsePayload> {
    return this.http.get<SharedWordSetResponsePayload>(this.serverUrl + '/' + wordSetId);
  }

  deleteShareCourse(wordSetId: number) {
    return this.http.delete(this.serverUrl + '/' + wordSetId);
  }

  getAllSharedCourse(): Observable<SharedWordSetResponsePayload[]> {
    return this.http.get<SharedWordSetResponsePayload[]>(this.serverUrl );
  }

  likeSharedWordSet(sharedWordSetId: number) {
    return this.http.post(this.serverUrl + '/like', sharedWordSetId);
  }

  dislikeSharedWordSet(sharedWordSetId: number) {
    return this.http.post(this.serverUrl + '/dislike', sharedWordSetId);
  }

  searchInWordSet(text: string, pageSize: number, pageNumber: number, sortType: SortingType, filter: string[]): Observable<SharedWordSetResponsePayload[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageNumber', pageNumber)
      .set('sortingType', SortingType[sortType])
      .set('filter', filter.join(', '));

      return this.http.get<SharedWordSetResponsePayload[]>(this.serverUrl + '/search/' + text, { params: params });
  }

}
