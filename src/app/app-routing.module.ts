import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { AuthComponent } from './components/auth/auth.component';
import { FriendsComponent } from './components/friends/friends.component';
import { MyListComponent } from './components/my-area/my-list/my-list.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-list',
    pathMatch: 'full',
  },
  {
    path: 'my-list',
    component: MyListComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'friends',
    component: FriendsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
