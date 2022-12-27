// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ServiceService } from './service.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public service: ServiceService, public router: Router) {}

  canActivate(): boolean {
    if (!this.service.user.value) {
      this.router.navigate(['auth']);
      return false;
    }
    return true;
  }
}
