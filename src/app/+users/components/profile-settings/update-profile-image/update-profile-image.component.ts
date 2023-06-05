import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { filesService } from "@shared/services";

@Component({
  selector: 'update-profile-image',
  templateUrl: './update-profile-image.component.html',
  styleUrls: ['./update-profile-image.component.scss']
})

/**
 * Profile Settings Component
 */
export class UpdateProfileImageComponent extends BaseComponent implements OnInit, OnChanges {

  image: File;
  src: string;
  @Input() userInfo: any;
  @Output() onImageChangeSend = new EventEmitter();
  @Input() activeId: number = 1;

  constructor
  (
      public override injector: Injector,
      public _imagesService: filesService,
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.src = this.userInfo?.image;
  }

  ngOnInit(): void {

  }

  onImageChange(event, imageTag) {
    const file = event.target.files[0] as File;

    if (!file || !this._imagesService.isValidImageExtension(file) || !this._imagesService.isValidFileSize(file, 1000)) return;

    let reader = new FileReader();
    reader.onloadend = () => {
      imageTag.src = reader.result;
    };

    this.image = file;
    reader.readAsDataURL(this.image);

    console.log(this.image);

    this.onImageChangeSend.emit(this.image);

  }

}
