import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wisher } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  title = 'secret santa';
  wisher!: Wisher | null;

  constructor(private service: ServiceService, private router: Router) {}

  ngOnInit(): void {
    this.service.wisher.subscribe((resp) => {
      this.wisher = resp;
    });
  }

  logout() {
    this.service.logout();
  }
}
