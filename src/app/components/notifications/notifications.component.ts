import { Component } from '@angular/core';
import { Person } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  people!: Person[] | null;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.service.wisher.subscribe((resp) => {
      if (resp && resp.requests) {
        this.people = resp.requests;
      }
    });
  }
}
