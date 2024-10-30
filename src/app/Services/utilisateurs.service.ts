import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { User } from '../Interface/variant';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  getUsers(): Observable<User[]> {
    const userCollection = collection(this.firestore, 'users');
    return collectionData(userCollection, { idField: 'id' }) as Observable<User[]>;
  }


  // Nouvelle méthode pour changer le statut isActive
  async toggleUserActiveStatus(userId: string, currentStatus: boolean): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(userDocRef, {
      isActive: !currentStatus // Change l'état à l'opposé de l'état actuel
    });
  }

  getUtilisateursCount(): Observable<number> {
    const UsersRef = collection(this.firestore, 'users');
    return collectionData(UsersRef).pipe(
      map((users: any[]) => users.length) // Compter le nombre de catégories
    );
  }
}
