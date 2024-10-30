// import {Component} from '@angular/core';
// import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
// import { inject } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule,
//     RouterModule,
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {
  
//   email: string = '';
//   password: string = '';
  
//   private auth: Auth = inject(Auth);
//   private router: Router = inject(Router);

//   // Function to handle login 
//   login() {
//     if (this.email && this.password) {
//       signInWithEmailAndPassword(this.auth, this.email, this.password)
//         .then(userCredential => {
//           // Login successful
//           console.log('User logged in:', userCredential.user);
//           this.router.navigate(['/produits']);
//         })
//         .catch(error => {
//           // Handle login error
//           console.error('Login error:', error.message);
//         });
//     }
//   }

// }











import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  // Fonction pour gérer la connexion
  async login() {
    // Vérification des champs requis
    if (!this.email || !this.password) {
      this.setErrorMessage('Veuillez entrer votre adresse email et votre mot de passe.');
      return; // Empêche la suite de l'exécution
    }
  
    try {
      // Récupérer les informations de l'utilisateur avec l'email (inclut le rôle)
      const userData = await this.authService.fetchUserDataByEmail(this.email);
  
      // Vérification si les données de l'utilisateur existent
      if (!userData) {
        this.setErrorMessage('Utilisateur non trouvé.');
        return; // Empêche la tentative de connexion
      }
  
      // Vérification du rôle de l'utilisateur avant la connexion
      const role = userData.role;
  
      if (role === 'client') {
        this.setErrorMessage('Accès refusé : vous n\'avez pas l\'autorisation de vous connecter. Veuillez vous connecter via l\'application client.');
        return; // Empêche la tentative de connexion
      }
  
      if (role === 'vendeur' && !userData.isActive) {
        this.setErrorMessage('Votre compte n\'a pas encore été vérifié par un administrateur. Veuillez attendre la validation.');
        return; // Empêche la tentative de connexion
      }
  
      // Si le rôle est valide (admin ou vendeur actif), procéder à la connexion
      const user = await this.authService.login(this.email, this.password);
  
      if (user) {
        this.handleRoleNavigation(role); // Naviguer selon le rôle
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'Erreur de connexion inconnue';
      this.setErrorMessage('Erreur de connexion : ' + errorMessage);
    }
  }
  

  private handleRoleNavigation(role: string) {
    if (role === 'admin' || role === 'vendeur') {
      this.router.navigate(['/dashboard']);
    } else {
      this.setErrorMessage('Accès refusé : rôle inconnu.');
    }
  }

  logout() {
    this.auth.signOut().then(() => {
      this.clearForm();
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Erreur lors de la déconnexion :', error);
    });
  }

  clearForm() {
    this.email = '';
    this.password = '';
  }

  private setErrorMessage(message: string) {
    this.errorMessage = message;
    console.error(message);
  }
}











