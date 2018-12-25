import { Component, OnInit, HostListener, Inject, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ContestService } from '../../services/contest.service';
import { TranslateService } from '../../services/translate.service';
import { AppHelper } from '../../services/app.helper';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { initialState } from '../../../../node_modules/ngx-bootstrap/timepicker/reducer/timepicker.reducer';
import { AuthService } from '../../services/auth.service';

Object.defineProperty(Array.prototype, 'chunk_inefficient', {
  value: function (chunkSize) {
    var array = this;
    return [].concat.apply([],
      array.map(function (elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  }
});

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  // @ViewChildren('imageSections') imageSections
  onResize(event) {
    this.images = this.fullArray.chunk_inefficient(Math.ceil(this.fullArray.length / this.widthContainer()))
  }

  public images: any;
  public fullArray: any;

  bsModalRef: BsModalRef;
  constructor(
    public router: Router,
    public contestProvider: ContestService,
    public translate: TranslateService,
    public helper: AppHelper,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.contestProvider.getImages()
      .then(res => {
        this.fullArray = res;
        // this.images = [
        //   [res[0]],
        //   [res[1]],
        //   [res[2]],
        //   [res[3]]
        // ]
        // const children = this.imageSections.toArray().map(x => x.nativeElement)
        // console.log(children)
        this.images = res.chunk_inefficient(Math.floor(res.length / this.widthContainer()))
      })
      .catch(err => {
        console.log(err)
        this.router.navigate(['/'])
      })
  }

  openDialog(img): void {
    const initialState = { img }
    this.bsModalRef = this.modalService.show(ImageModal, { initialState })
  }

  coolPhoto(id, i, $i) {
    this.images[i][$i].cooling = false

    if (!this.images[i][$i].cooling) {
      this.images[i][$i].cooling = true
      this.contestProvider.coolImage(id)
        .then(info => {
          if (info.status === 403) {
            if (info.error.message == 'Authorization Error: User is not logged in') {
              this.helper.openLoginDialog()
            }
          } else {
            this.images[i][$i].cooling = false
            if (info.status) {
              this.images[i][$i].userCooled = true
              this.images[i][$i].cools.push(true)
            } else {
              this.images[i][$i].userCooled = false
              this.images[i][$i].cools.pop()
            }
          }
        })
        .catch(err => {
          console.log('>> ERR:', err)
        })
    }
  }

  widthContainer() {
    const width = window.innerWidth;
    if (width >= 1200) {
      return 4;
    } else if (width < 1200 && width >= 992) {
      return 3;
    } else if (width < 9920 && width >= 768) {
      return 2;
    } else {
      return 1;
    }
  }

}

@Component({
  template: `
      <div>
        <div>
          <img [src]="img.thumbnail_path" style="width: 100%" (click)="onNoClick()"/>
        </div>
        <div style="background-color: #DEDEDE;">
          <form *ngIf='auth.user' class="newComment" [formGroup]="commentForm" (ngSubmit)="addComment()">
            <textarea formControlName="text" placeholder="Type your comment here..."></textarea>
            <div class='text-center'>
              <button mat-button style="background-color: #41C253; color: #FFF; font-family: 'Roboto', serif; font-weight: 400; text-transform: uppercase; margin-top: 5px;">Comment</button>
            </div>
          </form>
          <div class="comment" *ngFor="let comment of img.comments; let i = index">
            <div class="avatar col-xs-2">
              <img [src]="comment.user.profilePictureURL || 'https://s3.amazonaws.com/eyeou-public/anonymous-avatar-sm.jpg' " alt="" />
            </div>
            <div class="text col-xs-10" [class.fullRadius]='comment.viewReplies && comment.replies.length'>
              <h5>{{comment.user.firstName || 'Anonymous'}} {{comment.user.lastName || 'User'}}</h5>
              <p>{{comment.text}}</p>
              <div class="timestamp">{{comment.createdAt | date: 'shortDate'}}</div>
            </div>
            <div class="clearfix"></div>

            <div class="view-replies col-xs-10 col-xs-push-2" *ngIf='!comment.viewReplies && comment.replies.length' (click)="viewReplies(i, comment._id)">
              View replies.
            </div>

            <div class="view-replies col-xs-10 col-xs-push-2" *ngIf='!comment.viewReplies && !comment.replies.length' (click)="viewReplies(i, comment._id)">
              This comment has no replies.
            </div>

            <form [formGroup]='comment.replyForm' class='col-xs-10 col-xs-push-2' *ngIf='comment.viewReplies && auth.user' style='padding: 0'>
              <textarea formControlName='text' placeholder="Type your reply here..." style="margin: 10px 0px 0px; min-height: 55px; max-height: 55px; resize: none; width: 90%; display: inline-block"></textarea>
              <button (click)="reply(i, comment._id)" mat-icon-button style="top: -25px; background-color: #41C253; color: #FFF; position: relative; left: 7px;">
                <mat-icon style="position: relative; top: -3px;">reply</mat-icon>
              </button>
            </form>
            
            <div class='replies' *ngIf='comment.viewReplies && comment.replies.length'>
              <div class="reply col-xs-10 col-xs-push-2" *ngFor='let reply of comment.replies'>
                <div class="avatar col-xs-2">
                  <img [src]="reply.user.profilePictureURL || 'https://s3.amazonaws.com/eyeou-public/anonymous-avatar-sm.jpg'" alt="" />
                </div>
                <div class="text col-xs-10">
                  <h5>{{reply.user.firstName || 'Anonymous'}} {{reply.user.lastName || 'User'}}</h5>
                  <p>{{reply.text}}</p>
                  <div class="timestamp">{{reply.createdAt | date: 'shortDate'}}</div>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="clearfix"></div>
            </div>

            <div class="clearfix"></div>
          </div>
        </div>
      </div>
  `,
  styleUrls: ["./images.component.css"]
})
export class ImageModal implements OnInit {
  public img: any = {}
  public commentForm: FormGroup

  constructor(
    public fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public contestProvider: ContestService,
    public auth: AuthService
  ) {
  }

  onNoClick(): void {
    this.bsModalRef.hide()
  }

  buildCommentForm() {
    this.commentForm = this.fb.group({
      text: [null, Validators.required]
    })
  }

  viewReplies(i, id) {
    this.img.comments[i].replyForm = this.fb.group({
      text: [null, Validators.required]
    })
    this.contestProvider.getCommentReplies(id)
      .then(replies => {
        this.img.comments[i].viewReplies = true
        this.img.comments[i].replies = replies
      })
      .catch(err => {
        console.log(err)
      })
  }

  reply(i, id) {
    if (this.img.comments[i].replyForm.value.text) {
      const data = {
        text: this.img.comments[i].replyForm.value.text,
        commentId: id,
        imageId: null
      }
      this.img.comments[i].replyForm.reset()
      this.contestProvider.addComment(data)
        .then(reply => {
          this.contestProvider.getCommentReplies(id)
            .then(replies => {
              this.img.comments[i].viewReplies = true
              this.img.comments[i].replies = replies
            })
            .catch(err => {
              console.log(err)
            })
        })
    }
  }

  addComment() {
    if (this.commentForm.value.text) {
      const data = { imageId: this.img._id, text: this.commentForm.value.text, commentId: null }
      this.contestProvider.addComment(data)
        .then(comment => {
          this.commentForm.reset()
          this.contestProvider.getImage(this.img._id)
            .then(img => {
              this.img = img
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  ngOnInit() {
    this.buildCommentForm()
    this.contestProvider.getImage(this.img.id)
      .then(img => {
        this.img = img
      })
      .catch(err => {
        console.log(err)
      })
  }
}