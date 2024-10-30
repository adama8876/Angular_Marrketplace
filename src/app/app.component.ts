// import { Component, OnInit } from '@angular/core';
// import { Router, RouterOutlet } from '@angular/router';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatButtonModule } from '@angular/material/button';
// import { MatListModule } from '@angular/material/list';
// import { RouterModule } from '@angular/router';
// import { MatSelectModule } from '@angular/material/select';
// import { MatTableModule } from '@angular/material/table';
// import { MatDividerModule } from '@angular/material/divider';
// import { NgIf } from '@angular/common';
// import { MatMenuModule } from '@angular/material/menu';
// import { Auth, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
// import { AuthService } from './Services/auth.service';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     MatToolbarModule,
//     MatIconModule,
//     MatSidenavModule,
//     MatButtonModule,
//     MatListModule,
//     RouterModule,
//     MatSelectModule,
//     MatTableModule,
//     MatDividerModule,
//     NgIf,
//     MatMenuModule,
//   ],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   logIN: boolean = false;
//   userEmail: string | null = null;
//   userRole: string | null = null; // Variable pour stocker le rôle de l'utilisateur
//   title = 'baikasugu';

//   constructor(private auth: Auth, private router: Router, private authService: AuthService) {}

//   ngOnInit(): void {
//     const sessionDuration = 3600000;
//     let sessionStartTime = localStorage.getItem('sessionStartTime');

//     onAuthStateChanged(this.auth, async (user: User | null) => {
//       if (user) {
//         const currentTime = new Date().getTime();

//         if (!sessionStartTime) {
//           sessionStartTime = currentTime.toString();
//           localStorage.setItem('sessionStartTime', sessionStartTime);
//         }

//         this.logIN = true;
//         this.userEmail = user.email;

//         try {
//           // Récupérer le rôle de l'utilisateur depuis Firestore et le stocker dans `userRole$`
//           await this.authService.fetchUserRole();

//           // S'abonner à l'observable `userRole$` pour écouter les changements de rôle
//           this.authService.userRole$.subscribe((role: string | null) => {
//             this.userRole = role;
//             console.log('Rôle de l\'utilisateur:', this.userRole);

//             // Vérification stricte du rôle
//             if (this.userRole === 'admin' || this.userRole === 'vendeur') {
//               this.router.navigate(['/dashboard']); // Redirige vers le dashboard pour les rôles autorisés
//             } else {
//               this.logout(); // Déconnexion et redirection pour les rôles non autorisés
//               alert('Accès refusé : vous n\'avez pas l\'autorisation de vous connecter.');
//             }
//           });

//           // Vérification de la session
//           const intervalId = setInterval(() => {
//             const currentTimeInterval = new Date().getTime();
//             const storedStartTime = localStorage.getItem('sessionStartTime');

//             if (storedStartTime && (currentTimeInterval - Number(storedStartTime)) > sessionDuration) {
//               clearInterval(intervalId);
//               this.logout();
//             }
//           }, 1000);
//         } catch (error) {
//           console.error('Erreur lors de la récupération du rôle de l\'utilisateur :', error);
//         }
//       } else {
//         this.logIN = false;
//         this.userEmail = null;
//         this.router.navigate(['/login']);
//       }
//     });
//   }

//   // Fonction pour déconnecter l'utilisateur
//   logout(): void {
//     signOut(this.auth).then(() => {
//       this.logIN = false;
//       this.userEmail = null;
//       localStorage.removeItem('sessionStartTime');
//       this.router.navigate(['/login']);
//     }).catch((error) => {
//       console.error('Erreur lors de la déconnexion :', error);
//     });
//   }
// }

















import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Auth, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
    MatSelectModule,
    MatTableModule,
    MatDividerModule,
    NgIf,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  logIN: boolean = false;
  userEmail: string | null = null;
  userRole: string | null = null; 
  title = 'baikasugu';
  errorMessage: string | null = null; 

  constructor(private auth: Auth, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const sessionDuration = 3600000; // 1 heure en millisecondes
    let sessionStartTime = localStorage.getItem('sessionStartTime');

    // Surveillance de l'état d'authentification
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        const currentTime = new Date().getTime();

        if (!sessionStartTime) {
          sessionStartTime = currentTime.toString();
          localStorage.setItem('sessionStartTime', sessionStartTime);
        }

        this.logIN = true;
        this.userEmail = user.email;

        // Récupération du rôle de l'utilisateur
        try {
          await this.authService.fetchUserRole(); // Appel à fetchUserRole pour mettre à jour le rôle
          this.authService.userRole$.subscribe(role => {
            this.userRole = role; // Mise à jour du rôle
          });
        } catch (error) {
          console.error('Erreur lors de la récupération du rôle de l\'utilisateur :', error);
        }

        // Gestion de la durée de session
        const intervalId = setInterval(() => {
          const currentTimeInterval = new Date().getTime();
          const storedStartTime = localStorage.getItem('sessionStartTime');

          if (storedStartTime && (currentTimeInterval - Number(storedStartTime)) > sessionDuration) {
            clearInterval(intervalId);
            this.logout(); // Déconnexion après expiration de la session
          }
        }, 1000);

      } else {
        this.logIN = false;
        this.userEmail = null;
        this.userRole = null; // Réinitialisation du rôle lors de la déconnexion
        this.router.navigate(['/login']);
      }
    });
  }

  // Fonction pour déconnecter l'utilisateur
  logout(): void {
    this.authService.logout().then(() => { // Appel à la méthode logout du AuthService
      this.logIN = false;
      this.userEmail = null;
      this.userRole = null; // Réinitialisation du rôle
      localStorage.removeItem('sessionStartTime');
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Erreur lors de la déconnexion :', error);
    });
  }
}
