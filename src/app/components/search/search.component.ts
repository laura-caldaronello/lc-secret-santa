import { Component, OnInit } from '@angular/core';
import { Wisher } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  friends!: Wisher[] | null;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.service.friends.subscribe((resp) => (this.friends = resp));
  }
}
