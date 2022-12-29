import { Component, Input } from '@angular/core';
import { Person } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent {
  @Input() person!: Person;

  constructor(private service: ServiceService) {}

  sendRequest(person: Person) {
    this.service.sendRequest(person);
  }
}
