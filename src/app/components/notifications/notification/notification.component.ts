import { Component, Input } from '@angular/core';
import { Person } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() person!: Person;

  constructor(private service: ServiceService) {}

  acceptRequest(from: Person) {
    this.service.acceptRequest(from);
  }

  refuseRequest(from: Person) {
    this.service.refuseRequest(from);
  }
}
