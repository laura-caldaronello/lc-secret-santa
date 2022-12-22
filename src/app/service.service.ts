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
  friends = new BehaviorSubject<Wisher[] | null>(null);
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
          this.postWisher(resp);
          this.handleAuth(resp);
        })
      )
      .subscribe(); //giusto fare qui la subscribe? o va fatta quando si istanzia un certo componente?
  }

  autoLogin() {
    const userData = JSON.parse(<string>localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const user = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (user.token) {
      this.user.next(user);
      const expirationDuration =
        user.tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      this.getWisher(user.email.replace('@email.com', ''));
    }
  }

  postWisher(data: AuthResponseData) {
    this.http
      .post<Wisher>(
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/wishers.json',
        {
          username: data.email.replace('@email.com', ''),
        }
      )
      .pipe(
        map((resp) => {
          return {
            username: data.email.replace('@email.com', ''),
          };
        }),
        tap((resp) => this.getWisher(resp.username)) //side effect
      )
      .subscribe(); //giusto fare qui la subscribe? o va fatta quando si istanzia un certo componente?
  }

  getWisher(wisherUsername: string) {
    this.http
      .get<Wisher[] | Wisher | null>(
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/wishers.json'
      )
      .pipe(
        map((resp) => {
          if (!resp) {
            return null; //se non esistono wishers, ritorno null
          }
          if ((<Wisher>resp).username) {
            if ((<Wisher>resp).username === wisherUsername) {
              return <Wisher>resp; //se esiste uno wisher ed è quello giusto, lo ritorno
            } else {
              return null; //se esite uno wisher ma non è quello giusto, ritorno null
            }
          }
          //ultimo caso: trasformo da oggetto ad array
          const arr = Object.values(resp);
          const rightWisher = (<Wisher[]>arr).find(
            (wisher) => wisher.username === wisherUsername
          );
          return !!rightWisher ? <Wisher>rightWisher : null; //se esitono più wisher e c'è quello giusto, ritorno quello, altrimenti se ci sono più wisher ma non c'è quello giusto ritorno null
        }),
        tap((resp) => {
          if (resp) {
            this.getFriends(resp); //side effect: chiamo anche i friends
          }
        })
      )
      .subscribe((resp) => this.wisher.next(<Wisher | null>resp));
  }

  getFriends(inputWisher: Wisher) {
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
            return null; //se esiste un solo wisher o è se stesso e quindi non un amico, oppure è un altro e non va bene, perchè ci deve essere anche sè stesso
          }
          //ultimo caso: trasformo da oggetto ad array
          const arr = Object.values(resp);
          return (<Wisher[]>arr).filter(
            (wisher) => wisher.username !== inputWisher.username //l'ultima possibilità è ci sia effettivamente un array, allora sicuramente qualcosa deve tornare e posso filtrarlo per tutti quelli che non sono il wisher loggato
          );
        })
      )
      .subscribe((resp) => this.friends.next(<Wisher[] | null>resp));
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
