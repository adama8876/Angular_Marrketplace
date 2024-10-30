import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.currentUser;
    if (user) {
      return true; // L'utilisateur est authentifié
    } else {
      this.router.navigate(['/login']); // Redirection vers la page de connexion
      return false; // L'utilisateur n'est pas authentifié
    }
  }
}
