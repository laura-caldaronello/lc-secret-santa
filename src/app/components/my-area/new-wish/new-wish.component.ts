import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Wish } from 'src/app/models/wisher.model';
import { ServiceService } from 'src/app/service.service';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-new-wish',
  templateUrl: './new-wish.component.html',
  styleUrls: ['./new-wish.component.scss'],
})
export class NewWishComponent implements OnInit {
  wishForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private dialog: MatDialog
  ) {
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
      this.service.addWish(body);
    } else {
      this.dialog.open(AlertComponent, {
        panelClass: 'roundedModal',
        data: 'form invalid',
      });
    }
  }
}
