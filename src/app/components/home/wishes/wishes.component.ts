import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Wish, Wisher } from '../../../models/wisher.model';

@Component({
  selector: 'app-wishes',
  templateUrl: './wishes.component.html',
  styleUrls: ['./wishes.component.scss'],
})
export class WishesComponent implements OnInit, OnChanges {
  @Input() wisher!: Wisher;
  @Input() friend!: boolean;
  name!: string;
  wishes: Wish[] | undefined;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wisher) {
      this.name = this.wisher.username;
      this.wishes = this.wisher.wishes;
    }
  }

  iCanTake(wishIndex: number) {
    if (this.wishes && this.service.wisher.value) {
      return (
        //o non è preso, o è preso dall'utente loggato
        !this.wishes[wishIndex].taken ||
        (this.wishes[wishIndex].taken &&
          this.wishes[wishIndex].taker === this.service.wisher.value.username)
      );
    } else {
      return false;
    }
  }

  takeWish(wishIndex: number, friend: Wisher) {
    this.service.takeUntakeWish(true, wishIndex, friend);
  }

  untakeWish(wishIndex: number, friend: Wisher) {
    this.service.takeUntakeWish(false, wishIndex, friend);
  }
}
