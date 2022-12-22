import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from './auth/auth.component';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  signup(form: FormGroup) {
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
      .pipe(tap((resp) => this.putUser(resp)))
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  putUser(data: AuthResponseData) {
    this.http
      .put<User>(
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/users.json',
        {
          username: data.email.replace('@email.com', ''),
        }
      )
      .pipe(
        map((resp) => {
          let parsed = { ...resp };
          parsed.username = parsed.username.replace('@email.com', '');
          return parsed;
        })
      )
      .subscribe((response) => {
        this.getUser(response); //mettere in tap?
      });
  }

  getUser(inputUser: User) {
    this.http
      .get<User[] | User | null>(
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/users.json'
      )
      .pipe(
        map((resp) => {
          if (!resp) {
            return resp; //se non esistono users, ritorno null
          }
          if ((<User>resp).username) {
            if ((<User>resp).username === inputUser.username) {
              return resp; //se esiste uno user ed è quello giusto, lo ritorno
            } else {
              return null; //se esite uno user ma non è quello giusto, ritorno null
            }
          }
          const rightUser = (<User[]>resp).find(
            (user) => user.username === inputUser.username
          );
          return !!rightUser ? rightUser : null; //se esitono più user e c'è quello giusto, ritorno quello, altrimenti se ci sono più user ma non c'è quello giusto ritorno null
        })
      )
      .subscribe((resp) => this.user.next(<User | null>resp));
  }
}
