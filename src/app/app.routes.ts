import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { AuthGuard } from 'app/shared/guards';

export const ROUTES: Routes = [
  { path: '',      loadChildren: './private#PrivateModule', canActivate: [AuthGuard] },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },
];
