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

  isFriend(person: Person) {
    let wisher = this.service.wisher.value;
    if (wisher && wisher.friends) {
      let found = wisher.friends.find(
        (friend) => friend.username === person.username
      );
      if (found) {
        if (found.pending) {
          return 'pending';
        } else {
          return 'yes';
        }
      } else {
        return 'no';
      }
    }
    return 'no';
  }
}
