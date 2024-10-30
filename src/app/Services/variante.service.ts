import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Assure-toi d'utiliser AngularFire v9+
import { collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VarianteService {

  
  constructor(private firestore: AngularFirestore) {}

  // 1. Ajouter une variante à un type de variante existant
  addVariant(variantTypeId: string, variantData: { nom: string, value: string }): Promise<void> {
    const variantCollection = this.firestore.collection(`variantTypes/${variantTypeId}/variants`); // Collection des variantes
    const newVariantDoc = variantCollection.doc(); // Créer un document vide avec un ID unique
    
    return newVariantDoc.set({
      ...variantData,
      createdAt: new Date() // Date de création
    });
  }




  

  // // 2. Mettre à jour une variante existante
  // updateVariant(variantTypeId: string, variantId: string, updatedData: { nom?: string, value?: string }): Promise<void> {
  //   const variantDocRef = this.firestore.doc(`variantTypes/${variantTypeId}/variants/${variantId}`); // Référence à la variante
  //   return variantDocRef.update(updatedData); // Mise à jour des champs spécifiés
  // }

  // // 3. Supprimer une variante existante
  // deleteVariant(variantTypeId: string, variantId: string): Promise<void> {
  //   const variantDocRef = this.firestore.doc(`variantTypes/${variantTypeId}/variants/${variantId}`); // Référence à la variante
  //   return variantDocRef.delete(); // Supprimer le document
  // }

  // // 4. Récupérer toutes les variantes associées à un type de variante
  // getVariants(variantTypeId: string): Observable<any[]> {
  //   return this.firestore.collection(`variantTypes/${variantTypeId}/variants`).valueChanges({ idField: 'id' }); 
  //   // Renvoie un observable des variantes avec leur ID
  // }
}
