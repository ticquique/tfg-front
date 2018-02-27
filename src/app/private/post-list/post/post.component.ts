
import {
  Component,
  OnInit,
  AfterViewInit,
  Input
} from '@angular/core';
import { IPost } from '../../interfaces';

@Component({
  selector: 'post',
  providers: [

  ],
  styleUrls: ['./post.component.scss'],
  templateUrl: './post.component.html'
})
export class PostComponent implements OnInit, AfterViewInit {

  public _data: IPost;

  @Input()
  set data(value) {
    this._data = value;
  }

  public ngOnInit() {
    console.log('hello `Post` component');
  }

  public ngAfterViewInit() {
    console.log('view');
  }

}
