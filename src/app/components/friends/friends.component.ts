import { Component, Input, OnInit } from '@angular/core';
import { Wisher } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  friends!: Wisher[] | null;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.service.friends.subscribe((resp) => (this.friends = resp));
  }
}
