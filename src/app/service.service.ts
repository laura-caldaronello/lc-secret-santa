import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from './components/auth/auth.component';
import { Wish, Wisher } from './models/wisher.model';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  wisher = new BehaviorSubject<Wisher | null>(null);
  friends = new BehaviorSubject<Wisher[] | null>(null);
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  signupOrLogin(form: UntypedFormGroup, signup: boolean) {
    this.logout();
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
          //side effects: inserisco l'elemento nel database utenti+wishes e memorizzo l'utente
          this.handleAuth(resp); //memorizzo l'utente
          this.postWisher(resp);
        })
      )
      .subscribe((resp) => {
        this.router.navigate(['']);
      }); //giusto fare qui la subscribe? o va fatta quando si istanzia un certo componente?
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
        tap((resp) => {
          this.getWisherAndFriends(data.email.replace('@email.com', ''));
        })
      )
      .subscribe(); //giusto fare qui la subscribe? o va fatta quando si istanzia un certo componente?
  }

  updateWisher(wish: Wish) {
    var wisher = this.wisher.value;
    const dbKey = wisher ? wisher.dbKey : null;
    if (wisher && dbKey) {
      if (wisher.wishes) {
        wisher.wishes.push(wish);
      } else {
        wisher.wishes = [wish];
      }
      const body = { [<string>dbKey]: wisher };
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

  takeUntakeWish(take: boolean, wishIndex: number, friend: Wisher) {
    if (friend.wishes && this.wisher.value) {
      if (take) {
        friend.wishes[wishIndex].taken = true;
        friend.wishes[wishIndex].taker = this.wisher.value.username;
      } else {
        friend.wishes[wishIndex].taken = false;
        friend.wishes[wishIndex].taker = null;
      }
      const body = { [<string>friend.dbKey]: friend };
      this.http
        .patch<{ [dynamicKey: string]: Wisher }>(
          'https://lc-secret-santa-default-rtdb.europe-west1.firebasedatabase.app/wishers.json',
          body
        )
        .subscribe();
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
          return Object.entries(<{ [dynamicKey: string]: Wisher }>resp);
        })
      )
      .subscribe((resp) => {
        //con la risposta definisco il wisher...
        var wisher: Wisher | null = null;
        if (!resp) {
          wisher = null; //se non esistono wishers, ritorno null
        } else if (resp && resp.length === 1) {
          if (resp[0][1].username === wisherUsername) {
            wisher = resp[0][1]; //se esiste uno wisher ed è quello giusto, lo ritorno
          } else {
            wisher = null; //se esite uno wisher ma non è quello giusto, ritorno null
          }
        }
        //ultimo caso: trasformo da oggetto ad array
        else if (resp && resp.length > 1) {
          const rightWisher = resp
            .map((item) => {
              return { ...item[1], dbKey: item[0] };
            })
            .find((wisher) => wisher.username === wisherUsername);
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
          friends = resp
            .map((item) => {
              return { ...item[1], dbKey: item[0] };
            })
            .filter(
              (wisher) => wisher.username !== wisherUsername //l'ultima possibilità è ci sia effettivamente un array, allora sicuramente qualcosa deve tornare e posso filtrarlo per tutti quelli che non sono il wisher loggato
            );
        }
        this.friends.next(friends);
      });
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
    this.router.navigate(['/auth']);
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
