import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServiceService } from '../../service.service';
import { AlertComponent } from '../alert/alert.component';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  authForm: UntypedFormGroup;
  signup!: boolean;
  subscription!: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private service: ServiceService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.authForm = this.fb.group({
      username: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe((resp) => {
      if (resp.type === 'signup') {
        this.signup = true;
      }
      if (resp.type === 'login') {
        this.signup = false;
      }
    });
  }

  onSubmit(form: UntypedFormGroup) {
    if (form.valid) {
      this.service.signupOrLogin(this.authForm, this.signup);
    } else {
      this.dialog.open(AlertComponent, {
        panelClass: 'roundedModal',
        data: 'form invalid',
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
