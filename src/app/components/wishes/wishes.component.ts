import { Component, Input, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Wish, Wisher } from '../../models/wisher.model';

@Component({
  selector: 'app-wishes',
  templateUrl: './wishes.component.html',
  styleUrls: ['./wishes.component.scss'],
})
export class WishesComponent implements OnInit {
  @Input() wisher!: Wisher;
  @Input() friend!: boolean;
  name!: string;
  wishes: Wish[] | undefined;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.name = this.wisher.username;
    this.wishes = this.wisher.wishes;
  }

  takeWish(wishIndex: number, friend: Wisher) {
    this.service.takeWish(wishIndex, friend);
  }
}
