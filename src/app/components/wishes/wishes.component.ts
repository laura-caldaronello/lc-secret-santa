import { Component, Input, OnInit } from '@angular/core';
import { Wish } from '../../models/wisher.model';

@Component({
  selector: 'app-wishes',
  templateUrl: './wishes.component.html',
  styleUrls: ['./wishes.component.scss'],
})
export class WishesComponent implements OnInit {
  @Input() name!: string;
  @Input() wishes!: Wish[] | Wish | null;

  constructor() {}

  ngOnInit(): void {}
}
