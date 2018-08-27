import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadEvent, UploadFile, FileSystemEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { ContestService } from '../../services/contest.service';
import { AppHelper } from '../../services/app.helper';
import { TranslateService } from '../../services/translate.service';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {

  public uploading: Boolean = false;
  public files = [];
  public previewFiles: Array<any> = [];
  public contestId: string;
  public contest: any;
  public userId: string;
  public maxLimitReached: Boolean = false;
  public uploadLimit;

  constructor(
    public router: Router,
    public routeParams: ActivatedRoute,
    public contestProvider: ContestService,
    public helper: AppHelper,
    public translate: TranslateService,
    public auth: AuthService
  ) { }

  public browseFiles() {
    document.getElementById('selectedFiles').click()
  }

  public dropped(event, browse = false) {
    if (browse) {
      event.files = event.srcElement.files
      if ((this.files.length + 1 > this.uploadLimit) ||
        ((event.files.length + this.contest.users[0].images.length) > this.uploadLimit) ||
        ((this.files.length + 1 + this.contest.users[0].images.length) > this.uploadLimit)) {
        this.maxLimitReached = true;
        setTimeout(() => {
          this.maxLimitReached = false
        }, 1500)
      } else {
        console.log(event.srcElement.files)
        for (const file in event.srcElement.files) {
          console.log(event.srcElement.files[file])
          if (event.srcElement.files[file].size) {
            this.previewFiles.push({
              name: event.srcElement.files[file].name,
              size: event.srcElement.files[file].size,
              lastModifiedDate: event.srcElement.files[file].lastModified,
              type: event.srcElement.files[file].type,
              status: 'Added'
            });
            this.files.push(event.srcElement.files[file]);
            this.previewFiles = this.helper.removeDuplicates(this.previewFiles, 'name');
            this.files = this.helper.removeDuplicates(this.files, 'name');
          }
        }
      }
    } else {
      if ((this.files.length + 1 > this.uploadLimit) ||
        ((event.files.length + this.contest.users[0].images.length) > this.uploadLimit) ||
        ((this.files.length + 1 + this.contest.users[0].images.length) > this.uploadLimit)) {
        this.maxLimitReached = true;
        setTimeout(() => {
          this.maxLimitReached = false
        }, 1500)
      } else {
        console.log(this.files.length)
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
  }

  public uploadImages() {
    if (this.files.length) {
      console.log(this.files)
      for (const droppedFile of this.files) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        if (droppedFile instanceof File) {
          console.log(droppedFile);
          (async (file: File) => {
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
                if ($file.name == file.name) {
                  this.files.splice(i, 1);
                }
              });
              const contest = await this.contestProvider.getContestBySlug(localStorage.getItem('contestSlug'));
              this.contest = contest.contest;
              this.contest['timeRemains'] = this.helper.dateDiff(this.contest.review_time)
            } catch (e) {
              this.previewFiles.forEach($file => {
                if ($file.name == file.name) {
                  $file.status = 'Failed'
                }
              });
            }
          })(droppedFile);
        } else if (droppedFile instanceof UploadFile) {
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
              const contest = await this.contestProvider.getContestBySlug(localStorage.getItem('contestSlug'));
              this.contest = contest.contest;
              this.contest['timeRemains'] = this.helper.dateDiff(this.contest.review_time)
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
  }

  public removeDropped(index) {
    this.files.splice(index, 1);
    this.previewFiles.splice(index, 1);
    if (this.files.length + 1 <= this.uploadLimit && this.previewFiles.length <= this.uploadLimit) {
      this.maxLimitReached = false;
    }
  }

  async ngOnInit() {
    try {
      const user = await this.auth.me()
      this.userId = user._id
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
          this.contestProvider.getContestBySlug(data.slug)
            .then(async res => {
              if (!res.userIncluded) {
                try {
                  const joinContest = await this.contestProvider.joinFreeContest(this.contestId);
                  const contest = await this.contestProvider.getContestBySlug(data.slug);
                  this.contest = contest.contest;
                  this.contest['timeRemains'] = this.helper.dateDiff(this.contest.review_time)
                  this.contest.prize_money == 0 ? this.uploadLimit = 1 : this.uploadLimit = 10;
                  localStorage.setItem('contestSlug', data.slug);
                } catch (e) {
                  this.router.navigate(['/']);
                }
              } else {
                this.contest = res.contest;
                this.contest.prize_money == 0 ? this.uploadLimit = 1 : this.uploadLimit = 10;
                this.contest['timeRemains'] = this.helper.dateDiff(this.contest.review_time)
                localStorage.setItem('contestSlug', data.slug);
              }
            })
            .catch(err => {
              this.router.navigate(['/']);
            });
        });
      }
    } catch (e) {

    }
  }

}
