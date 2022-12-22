import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from './components/auth/auth.component';
import { Wisher } from './models/wisher.model';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  wisher = new BehaviorSubject<Wisher | null>(null);
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) {}

  signupOrLogin(form: FormGroup, signup: boolean) {
    const action = signup ? 'signUp' : 'signInWithPassword';
    this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:' +
          action +
          '?key=' +
          environment.firebaseAPIkey,
        {
          email: form.value.username + '@email.com',
          password: form.value.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resp) => {
          //side effects: inserisco l'elemento nel database utenti+wishes e memorizzo la sessione
          this.putWisher(resp);
          this.handleAuth(resp);
        })
      )
      .subscribe(); //giusto fare qui la subscribe? o va fatta quando si istanzia un certo componente?
  }

  putWisher(data: AuthResponseData) {
    this.http
      .put<Wisher>(
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/wishers.json',
        {
          username: data.email.replace('@email.com', ''),
        }
      )
      .pipe(
        map((resp) => {
          let parsed = { ...resp };
          parsed.username = parsed.username.replace('@email.com', '');
          return parsed;
        }),
        tap((resp) => this.getWisher(resp)) //side effect
      )
      .subscribe(); //giusto fare qui la subscribe? o va fatta quando si istanzia un certo componente?
  }

  getWisher(inputWisher: Wisher) {
    this.http
      .get<Wisher[] | Wisher | null>(
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/wishers.json'
      )
      .pipe(
        map((resp) => {
          if (!resp) {
            return resp; //se non esistono wishers, ritorno null
          }
          if ((<Wisher>resp).username) {
            if ((<Wisher>resp).username === inputWisher.username) {
              return resp; //se esiste uno wisher ed è quello giusto, lo ritorno
            } else {
              return null; //se esite uno wisher ma non è quello giusto, ritorno null
            }
          }
          const rightWisher = (<Wisher[]>resp).find(
            (wisher) => wisher.username === inputWisher.username
          );
          return !!rightWisher ? rightWisher : null; //se esitono più wisher e c'è quello giusto, ritorno quello, altrimenti se ci sono più wisher ma non c'è quello giusto ritorno null
        })
      )
      .subscribe((resp) => this.wisher.next(<Wisher | null>resp));
  }

  handleAuth(resData: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      expirationDate
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    const expirationDuration =
      user.tokenExpirationDate.getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  handleError(error: HttpErrorResponse) {
    alert(error.error.error.message);
    return throwError(error);
  }
}
