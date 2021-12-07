import { AuthService } from './../../../auth/auth.service';
import { CommentRequestPayload } from './commentRequest.payload';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from './../comment.service';
import { Component, OnInit } from '@angular/core';
import { CommentResponsePayload } from './commentResponse.payload';

@Component({
  selector: 'app-course-comments',
  templateUrl: './course-comments.component.html',
  styleUrls: ['./course-comments.component.scss']
})
export class CourseCommentsComponent implements OnInit {

  sharedWordSetId!: number;
  commentList!: Array<CommentResponsePayload>;
  comment: string = '';

  constructor(private commentService: CommentService, private ActivatedRoute: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(data => {
      this.sharedWordSetId = data.id;
      this.commentService.getComments(this.sharedWordSetId).subscribe(comments => {
        this.commentList = comments;
      }, error => {
        console.log(error);
      });
    });
  }

  addComment() {
    if (this.comment.length > 0) {
      let email = this.authService.getUserEmail();
      let request: CommentRequestPayload = {
        userEmail: email ? email : 'email error',
        sharedWordSetId: this.sharedWordSetId,
        comment: this.comment
      };
      this.commentService.addComment(request).subscribe(data => {
        this.ngOnInit();
      }, error => {
        console.log(error);
      });
    }
  }
}
