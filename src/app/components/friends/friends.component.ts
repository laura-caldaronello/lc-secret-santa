import { Component, Input, OnInit } from '@angular/core';
import { Wisher } from 'src/app/models/wisher.model';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  @Input() friends!: Wisher[];

  constructor() {}

  ngOnInit(): void {}
}
