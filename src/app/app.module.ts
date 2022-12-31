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
import { MatDialogModule } from '@angular/material/dialog';

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
import { PersonComponent } from './components/search/person/person.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationComponent } from './components/notifications/notification/notification.component';
import { AlertComponent } from './components/alert/alert.component';

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
    PersonComponent,
    NotificationsComponent,
    NotificationComponent,
    AlertComponent,
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
    MatDialogModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
