import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Wish } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-new-wish',
  templateUrl: './new-wish.component.html',
  styleUrls: ['./new-wish.component.scss'],
})
export class NewWishComponent implements OnInit {
  wishForm: FormGroup;

  constructor(private fb: FormBuilder, private service: ServiceService) {
    this.wishForm = this.fb.group({
      name: new FormControl('', Validators.required),
      link: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  onSubmit(form: FormGroup) {
    if (form.valid) {
      const value = form.value;
      const body = new Wish(value.name, false, null, value.link);
      this.service.updateWisher(body);
    } else {
      alert('error');
    }
  }
}
