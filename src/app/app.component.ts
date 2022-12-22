import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ServiceService } from './service.service';
import { Wisher } from './models/wisher.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lc-secret-santa';
  wisher: Wisher | null = null;
  friends: Wisher[] | null = null;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.service.autoLogin();
    this.service.wisher.subscribe((resp) => (this.wisher = resp));
    this.service.friends.subscribe((resp) => (this.friends = resp));
  }
}
