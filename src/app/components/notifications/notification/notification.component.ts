import { Component, Input } from '@angular/core';
import { Person } from 'src/app/models/wisher.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() person!: Person;
}
