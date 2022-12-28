import { Component, OnInit } from '@angular/core';
import { Wisher } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  wisher: Wisher | null = null;
  friends: Wisher[] | null = null;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.service.wisher.subscribe((resp) => (this.wisher = resp));
    this.service.friends.subscribe((resp) => (this.friends = resp));
  }
}
