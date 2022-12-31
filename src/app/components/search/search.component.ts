import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Person } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  people = new BehaviorSubject<Person[] | null>(null);
  subscription1!: Subscription;
  subscription2!: Subscription;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.subscription1 = this.service.wisher.subscribe((wisher) => {
      if (wisher) {
        this.subscription2 = this.service
          .getPeople(wisher.username)
          .subscribe((resp) => {
            this.people.next(resp);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
