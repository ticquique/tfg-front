
import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { PostService } from '../services';

@Component({
  selector: 'post-list',
  providers: [

  ],
  styleUrls: ['./postList.component.scss'],
  templateUrl: './postList.component.html'
})
export class PostListComponent implements OnInit, AfterViewInit {

  constructor(
    public postService: PostService
  ) {}

  public ngOnInit() {
    console.log('hello `PostList` component');
  }

  public ngAfterViewInit() {
    console.log('view');
  }

}
