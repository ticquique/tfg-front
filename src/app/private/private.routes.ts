import { PrivateComponent } from './private.component';
import { PostListComponent } from 'app/private/post-list';
import { ChatPageComponent } from 'app/private/chat';

export const routes = [
  { path: '', component: PrivateComponent, children: [
    { path: '', component: PostListComponent },
    { path: 'chat2', component: ChatPageComponent}
  ]},
];
