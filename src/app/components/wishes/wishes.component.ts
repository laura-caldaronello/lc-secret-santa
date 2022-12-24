import { Component, Input, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Wish } from '../../models/wisher.model';

@Component({
  selector: 'app-wishes',
  templateUrl: './wishes.component.html',
  styleUrls: ['./wishes.component.scss'],
})
export class WishesComponent implements OnInit {
  @Input() name!: string;
  @Input() wishes!: Wish[] | null;
  @Input() friend!: boolean;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {}

  takeWish(wish: Wish, name: string) {
    //this.service.takeWish(wish);
  }
}
