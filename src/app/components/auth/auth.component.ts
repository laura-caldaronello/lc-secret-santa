import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ServiceService } from '../../service.service';

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
export class AuthComponent implements OnInit {
  authForm: UntypedFormGroup;
  signup: boolean = true;

  constructor(private fb: UntypedFormBuilder, private service: ServiceService) {
    this.authForm = this.fb.group({
      username: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {}

  onSubmit(form: UntypedFormGroup) {
    if (form.valid) {
      this.service.signupOrLogin(this.authForm, this.signup);
    } else {
      alert('error');
    }
  }
}
