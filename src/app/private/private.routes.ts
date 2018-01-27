import { PrivateComponent } from './private.component';

export const routes = [
  { path: '', children: [
    { path: '', component: PrivateComponent }
  ]},
];
