// import { Injectable } from '@angular/core';
// import { Auth, User } from '@angular/fire/auth';
// import { Firestore, doc, getDoc } from '@angular/fire/firestore';
// import { BehaviorSubject, Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private userRole = new BehaviorSubject<string | null>(null); // Stockage du rôle avec BehaviorSubject
//   userRole$: Observable<string | null> = this.userRole.asObservable(); // Observable pour suivre les changements de rôle

//   constructor(private auth: Auth, private firestore: Firestore) {}

//   // Méthode pour récupérer les informations utilisateur, y compris le rôle
//   async fetchUserRole(): Promise<void> {
//     const user = this.auth.currentUser;
//     if (user) {
//       const userDocRef = doc(this.firestore, `users/${user.uid}`);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const role = userDoc.data()['role'] as string;
//         this.userRole.next(role); // Mise à jour du BehaviorSubject avec le rôle
//       }
//     }
//   }

//   // Méthode pour obtenir l'utilisateur actuel
//   getCurrentUser(): User | null {
//     return this.auth.currentUser;
//   }
// }













import { Injectable } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole = new BehaviorSubject<string | null>(null); // Stockage du rôle avec BehaviorSubject
  userRole$: Observable<string | null> = this.userRole.asObservable(); // Observable pour suivre les changements de rôle

  constructor(private auth: Auth, private firestore: Firestore) {}

  // Méthode pour récupérer les informations utilisateur par email
  async fetchUserDataByEmail(email: string): Promise<any | null> {
    const usersCollectionRef = collection(this.firestore, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data(); // Retourne les données de l'utilisateur
    }
    return null; // Si l'utilisateur n'existe pas
  }

  // Méthode de connexion
  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Appel de la méthode pour récupérer et stocker le rôle de l'utilisateur connecté
      await this.fetchUserRole(); // Cette méthode est mise à jour pour appeler la méthode de récupération de rôle après connexion

      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Méthode pour déconnecter l'utilisateur
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userRole.next(null); // Réinitialiser le rôle lors de la déconnexion
  }

  // Méthode pour récupérer les données de l'utilisateur par UID
  async fetchUserData(uid: string): Promise<any | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  }

  // Méthode pour obtenir l'utilisateur courant
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Méthode pour obtenir le rôle de l'utilisateur
  async fetchUserRole(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const role = userDoc.data()['role'] as string;
        this.userRole.next(role); // Mise à jour du BehaviorSubject avec le rôle
        return role; // Retourner le rôle
      }
    }
    return null; // Retourner null si l'utilisateur n'est pas connecté ou le rôle n'est pas trouvé
  }
}


