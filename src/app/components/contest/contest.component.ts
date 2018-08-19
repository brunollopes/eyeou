import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadEvent, UploadFile, FileSystemEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { ContestService } from '../../services/contest.service';
import { AppHelper } from '../../services/app.helper';
import { TranslateService } from '../../services/translate.service';
import { join } from 'path';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {

  public uploading: Boolean = false;
  public files: UploadFile[] = [];
  public previewFiles: Array<any> = [];
  public contestId: string;
  public contest: any;
  public userId: string;
  public maxLimitReached: Boolean = false;

  constructor(
    public router: Router,
    public routeParams: ActivatedRoute,
    public contestProvider: ContestService,
    public helper: AppHelper,
    public translate: TranslateService
  ) { }

  public dropped(event: UploadEvent) {
    if ((this.files.length + 1> 10) || ((event.files.length + this.contest.users[0].images.length) > 10) || ((this.files.length + 1 + this.contest.users[0].images.length) > 10)) {
      this.maxLimitReached = true;
    } else {
      this.maxLimitReached = false;
      event.files.forEach(file => { this.files.push(file); });
      this.files = this.helper.removeDuplicates(this.files, 'relativePath');
      for (const droppedFile of this.files) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            this.previewFiles.push({
              name: file.name,
              size: file.size,
              lastModifiedDate: file.lastModified,
              type: file.type,
              status: 'Added'
            });
            this.previewFiles = this.helper.removeDuplicates(this.previewFiles, 'name');
          });
        } else {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        }
      }
    }
  }

  public uploadImages() {
    if (this.files.length) {
      for (const droppedFile of this.files) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          try {
            const formData = new FormData();
            formData.append('image', file, file.name);
            formData.append('user_id', this.userId);
            formData.append('contest_name', this.contestId);
            this.uploading = true;
            this.previewFiles.forEach($file => {
              if ($file.name == file.name) {
                $file.status = 'Uploading'
              }
            });
            const uploadProcess = await this.contestProvider.uploadimages(formData);
            this.previewFiles.forEach($file => {
              if ($file.name == file.name) {
                $file.status = 'Uploaded'
              }
            });
            this.files.forEach(($file, i) => {
              if ($file.relativePath == file.name) {
                this.files.splice(i, 1);
              }
            });
            const contest = await this.contestProvider.getContestBySlug(localStorage.getItem('contestSlug'), this.userId);
            this.contest = contest.contest;
          } catch (e) {
            this.previewFiles.forEach($file => {
              if ($file.name == file.name) {
                $file.status = 'Failed'
              }
            });
          }
        });
      }
    }
  }

  public removeDropped(index) {
    this.files.splice(index, 1);
    this.previewFiles.splice(index, 1);
    if (this.files.length + 1 <= 10 && this.previewFiles.length <= 10) {
      this.maxLimitReached = false;
    }
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      this.router.navigate(['/'])
    } else {
      this.routeParams.params.subscribe(async data => {
        if (!data.slug) this.router.navigate(['/'])
        try {
          const contest = await this.contestProvider.getContestIdBySlug(data.slug);
          this.contestId = contest._id;
        } catch (e) {
          this.router.navigate(['/']);
        }
        this.contestProvider.getContestBySlug(data.slug, this.userId)
          .then(async res => {
            if (!res.userIncluded) {
              try {
                const joinContest = await this.contestProvider.joinFreeContest(this.userId, this.contestId);
                const contest = await this.contestProvider.getContestBySlug(data.slug, this.userId);
                this.contest = contest.contest;
                localStorage.setItem('contestSlug', data.slug);
              } catch (e) {
                this.router.navigate(['/']);
              }
            } else {
              this.contest = res.contest;
              localStorage.setItem('contestSlug', data.slug);
            }
          })
          .catch(err => {
            this.router.navigate(['/']);
          });
      });
    }
  }

}
