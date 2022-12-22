import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/user.model';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

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
  //user: Observable<User>;
  authForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            environment.firebaseAPIkey,
          {
            email: form.value.username + '@email.com',
            password: form.value.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          /* catchError(this.handleError), */
          tap((resp) => this.handleAuth(resp))
        )
        .subscribe((resp) => {
          console.log(resp);
        });
    } else {
      alert('error');
    }
  }

  handleAuth(data: AuthResponseData) {
    this.http
      .put<User>(
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/users.json',
        {
          username: data.email.replace('@email.com', ''),
        }
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
