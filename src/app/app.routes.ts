import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { PasswordChangeComponent } from './semiprivate';
import { NoContentComponent } from './no-content';
import { AuthGuard } from 'app/shared/guards';

export const ROUTES: Routes = [
  { path: '',      loadChildren: './private#PrivateModule', canActivate: [AuthGuard] },
  { path: 'home',  component: HomeComponent },
  { path: 'passwordchange/:token',  component: PasswordChangeComponent },
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },
];
