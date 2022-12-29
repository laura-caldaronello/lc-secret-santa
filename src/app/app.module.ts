import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { FriendsComponent } from './components/friends/friends.component';
import { AuthGuardService } from './auth-guard.service';
import { HeaderComponent } from './components/header/header.component';
import { WishesComponent } from './components/wishes/wishes.component';
import { NewWishComponent } from './components/my-area/new-wish/new-wish.component';
import { MyListComponent } from './components/my-area/my-list/my-list.component';
import { SearchComponent } from './components/search/search.component';
import { UserComponent } from './components/search/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    WishesComponent,
    FriendsComponent,
    NewWishComponent,
    HeaderComponent,
    MyListComponent,
    SearchComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatExpansionModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
