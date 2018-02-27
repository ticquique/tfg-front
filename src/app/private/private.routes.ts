import { PrivateComponent } from './private.component';
import { PostListComponent } from 'app/private/post-list';
import { ChatPageComponent } from 'app/private/chat';
import { SettingsComponent } from 'app/private/settings';
import { ProfileComponent } from 'app/private/profile';

export const routes = [
  { path: '', component: PrivateComponent, children: [
    { path: '', component: PostListComponent },
    { path: 'chat', component: ChatPageComponent},
    { path: 'settings', component: SettingsComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'profile/:username', component: ProfileComponent}
  ]},
];
