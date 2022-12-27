import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user!: User | null;

  constructor(private service: ServiceService, private router: Router) {}

  ngOnInit(): void {
    this.service.user.subscribe((resp) => {
      this.user = resp;
    });
  }

  logout() {
    this.service.logout();
  }
}
