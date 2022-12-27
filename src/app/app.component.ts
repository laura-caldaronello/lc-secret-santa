import { Component, OnInit } from '@angular/core';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lc-secret-santa';

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.service.autoLogin();
  }
}
