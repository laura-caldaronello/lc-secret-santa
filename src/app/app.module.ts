import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { WishesComponent } from './components/home/wishes/wishes.component';
import { FriendsComponent } from './components/home/friends/friends.component';
import { NewWishComponent } from './components/home/new-wish/new-wish.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from './auth-guard.service';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    WishesComponent,
    FriendsComponent,
    NewWishComponent,
    HomeComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
