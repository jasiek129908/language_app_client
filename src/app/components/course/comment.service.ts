import { CommentRequestPayload } from './course-comments/commentRequest.payload';
import { Observable } from 'rxjs';
import { CommentResponsePayload } from './course-comments/commentResponse.payload';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly serverUrl: string = 'http://localhost:8080/api/comment';

  constructor(private http: HttpClient) { }

  getComments(sharedWordSetId: number): Observable<CommentResponsePayload[]> {
    return this.http.get<CommentResponsePayload[]>(this.serverUrl + '/' + sharedWordSetId);
  }

  addComment(request: CommentRequestPayload) {
    return this.http.post(this.serverUrl, request);
  }
}
