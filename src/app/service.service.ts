import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from './components/auth/auth.component';
import { Wish, Wisher } from './models/wisher.model';
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

  signupOrLogin(form: UntypedFormGroup, signup: boolean) {
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
          //side effects: inserisco l'elemento nel database utenti+wishes
          this.postWisher(resp);
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
      new Date(userData._tokenExpirationDate),
      userData._dbKey
    );
    if (user.token) {
      this.user.next(user);
      const expirationDuration =
        user.tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      this.getWisherAndFriends(user.email.replace('@email.com', ''));
    }
  }

  postWisher(data: AuthResponseData) {
    this.http
      .post<{ name: string }>( //la put sovrascrive tutto
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/wishers.json',
        {
          username: data.email.replace('@email.com', ''),
        }
      )
      .pipe(
        map((resp) => {
          return {
            dbKey: resp.name,
            username: data.email.replace('@email.com', ''),
          };
        }),
        tap((resp) => {
          this.handleAuth(data, resp.dbKey); //memorizzo l'utente
          this.getWisherAndFriends(resp.username);
        })
      )
      .subscribe(); //giusto fare qui la subscribe? o va fatta quando si istanzia un certo componente?
  }

  updateWisher(wish: Wish) {
    const dbKey = this.user.value ? this.user.value.dbKey : null;
    var wisher = this.wisher.value;
    if (wisher) {
      if (wisher.wishes) {
        wisher.wishes.push(wish);
      } else {
        wisher.wishes = [wish];
      }
    }
    const body = { [<string>dbKey]: wisher };
    if (dbKey && wisher) {
      this.http
        .patch<{ [dynamicKey: string]: Wisher }>(
          'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/wishers.json',
          body
        )
        .subscribe((resp) => {
          const wisher = resp[dbKey];
          this.wisher.next(wisher);
        });
    }
  }

  getWisherAndFriends(wisherUsername: string) {
    this.http
      .get<{ [dynamicKey: string]: Wisher } | null>(
        'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/wishers.json'
      )
      .pipe(
        map((resp) => {
          if (!resp) {
            return null;
          }
          return Object.values(<{ [dynamicKey: string]: Wisher }>resp);
        })
      )
      .subscribe((resp) => {
        //con la risposta definisco il wisher...
        var wisher: Wisher | null = null;
        if (!resp) {
          wisher = null; //se non esistono wishers, ritorno null
        } else if (resp && resp.length === 1) {
          if (resp[0].username === wisherUsername) {
            wisher = resp[0]; //se esiste uno wisher ed è quello giusto, lo ritorno
          } else {
            wisher = null; //se esite uno wisher ma non è quello giusto, ritorno null
          }
        }
        //ultimo caso: trasformo da oggetto ad array
        else if (resp && resp.length > 1) {
          const rightWisher = resp.find(
            (wisher) => wisher.username === wisherUsername
          );
          wisher = !!rightWisher ? rightWisher : null; //se esitono più wisher e c'è quello giusto, ritorno quello, altrimenti se ci sono più wisher ma non c'è quello giusto ritorno null
        }
        this.wisher.next(wisher);

        //...e i friends
        var friends: Wisher[] | null = null;
        if (!resp) {
          friends = null; //se non esistono wishers, ritorno null
        } else if (resp && resp.length === 1) {
          friends = null; //se esiste un solo wisher o è se stesso e quindi non un amico, oppure è un altro e non va bene, perchè ci deve essere anche sè stesso
        }
        //ultimo caso: trasformo da oggetto ad array
        else if (resp && resp.length > 1) {
          friends = resp.filter(
            (wisher) => wisher.username !== wisherUsername //l'ultima possibilità è ci sia effettivamente un array, allora sicuramente qualcosa deve tornare e posso filtrarlo per tutti quelli che non sono il wisher loggato
          );
        }
        this.friends.next(friends);
      });
  }

  handleAuth(resData: AuthResponseData, dbKey: string) {
    const expirationDate = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      expirationDate,
      dbKey
    );
    this.user.next(user);
    console.log(user);
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
