import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { Wisher, Wish } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

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

  ngOnInit(): void {
    this.service
      .getWisher(this.wisher.username)
      .pipe(
        map((resp) => {
          if (resp) {
            return {
              username: resp.username,
              wishes: resp.wishes,
              dbKey: resp.dbKey,
            };
          }
          return resp;
        })
      )
      .subscribe((resp) => {
        if (resp) {
          this.wisher = resp;
          this.name = resp.username;
          this.wishes = resp.wishes;
        }
      });
  }

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

  deleteWish(wish: Wish) {
    this.service.deleteWish(wish);
  }
}
