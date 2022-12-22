import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
  authForm: FormGroup;
  signup: boolean = true;

  constructor(private fb: FormBuilder, private service: ServiceService) {
    this.authForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {}

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.service.signupOrLogin(this.authForm, this.signup);
    } else {
      alert('error');
    }
  }
}
