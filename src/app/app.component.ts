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
  wisher: Wisher | null = null; //gestire il login già presente in sessione
  friends: Wisher[] | null = null;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    if (this.wisher) {
      this.service.getWisher(this.wisher); //se entro essendo già loggato (da fare questa parte), con le info della sessione, allora carico già i wishes
      this.service.getFriends(this.wisher); //allo stesso modo per i friends
    }
    this.service.wisher.subscribe((resp) => (this.wisher = resp));
    this.service.friends.subscribe((resp) => (this.friends = resp));
  }
}
