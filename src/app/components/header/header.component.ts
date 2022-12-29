import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Wisher } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  wisher!: Wisher | null;

  constructor(private service: ServiceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.service.wisher.subscribe((resp) => {
      this.wisher = resp;
    });
  }

  logout() {
    this.service.logout();
  }

  openNotifications() {
    this.dialog.open(NotificationsComponent);
  }
}
