import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ServiceService } from './service.service';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lc-secret-santa';
  user: User | null = null;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.service.user.subscribe((resp) => (this.user = resp));
    if (this.user) {
      this.service.getUser(this.user); //se entro essendo già loggato, con le info della sessione, allora carico già i wishes
    }
  }
}
