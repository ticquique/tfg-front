import { PrivateComponent } from './private.component';
import { PostListComponent } from 'app/private/post-list';
import { ChatPageComponent, ChatPage2Component } from 'app/private/chat';

export const routes = [
  { path: '', component: PrivateComponent, children: [
    { path: '', component: PostListComponent },
    { path: 'chat', component: ChatPageComponent},
    { path: 'chat2', component: ChatPage2Component}
  ]},
];
