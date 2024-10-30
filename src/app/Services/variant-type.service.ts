import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, collectionData, deleteDoc, updateDoc, arrayUnion, docData,  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User, Variant } from '../Interface/variant';
@Injectable({
  providedIn: 'root'
})
export class VariantTypeService {
  
  constructor(private firestore: Firestore) { }

  // Ajouter un variant type à Firestore
  addVariantType(variantType: { nom: string; type: string; createdAt?: any }): Promise<void> {
    const variantTypeCollection = collection(this.firestore, 'variantTypes'); // Collection 'variantTypes'
    const newDocRef = doc(variantTypeCollection); // Créer une nouvelle référence de document avec un ID unique

    return setDoc(newDocRef, {
      ...variantType,
      createdAt: variantType.createdAt || new Date() // Utiliser la date actuelle si non fournie
    })
    .then(() => {
      console.log('Variant type ajouté avec succès');
    })
    .catch((error) => {
      console.error('Erreur lors de l\'ajout du variant type :', error);
    });
  }

  // Méthode pour obtenir tous les variant types
  getVariantTypes(): Observable<any[]> {
    const variantTypeCollection = collection(this.firestore, 'variantTypes');
    return collectionData(variantTypeCollection, { idField: 'id' }) as Observable<any[]>;
  }



   // Mettre à jour un variant type existant
   updateVariantType(id: string, updatedData: { nom?: string; type?: string }): Promise<void> {
    const variantTypeDocRef = doc(this.firestore, `variantTypes/${id}`); // Référence au document existant à mettre à jour
    return updateDoc(variantTypeDocRef, updatedData)
      .then(() => {
        console.log('Variant type mis à jour avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du variant type :', error);
      });
  }
  

  // Supprimer un variant type de Firestore
  deleteVariantType(id: string): Promise<void> {
    const variantTypeDocRef = doc(this.firestore, `variantTypes/${id}`); // Référence au document à supprimer
    return deleteDoc(variantTypeDocRef)
    .then(() => {
      console.log('Variant type supprimé avec succès');
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression du variant type :', error);
    });
  }




// --------------------------------------------------------------------------------------------------------------------





  addVariantToVariantType(variantTypeId: string, variantNom: string): Promise<void> {
    const variantTypeDocRef = doc(this.firestore, `variantTypes/${variantTypeId}`); // Référence au document variant type
  
    return updateDoc(variantTypeDocRef, {
      variants: arrayUnion(variantNom) // Ajoute la variante à la liste des variantes
    })
    .then(() => {
      console.log('Variante ajoutée avec succès à la variante type');
    })
    .catch((error) => {
      console.error('Erreur lors de l\'ajout de la variante à la variante type :', error);
    });
  }





  addVariant(variantTypeId: string, variantNom: string): Promise<void> {
    const variantCollection = collection(this.firestore, 'variants'); // Collection 'variants'
    const newVariantDocRef = doc(variantCollection); // Créer une nouvelle référence de document avec un ID unique
  
    return setDoc(newVariantDocRef, {
      nom: variantNom,
      variantTypeId: variantTypeId, // Lien avec le type de variante
      createdAt: new Date() // Ajouter la date actuelle
    })
    .then(() => {
      console.log('Nouvelle variante ajoutée avec succès');
    })
    .catch((error) => {
      console.error('Erreur lors de l\'ajout de la nouvelle variante :', error);
    });
  }



  // Mettre à jour une variante existante
updateVariant(id: string, updatedData: { nom?: string; variantTypeId?: string }): Promise<void> {
  const variantDocRef = doc(this.firestore, `variants/${id}`); // Référence au document existant à mettre à jour

  return updateDoc(variantDocRef, updatedData)
    .then(() => {
      console.log('Variante mise à jour avec succès');
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour de la variante :', error);
    });
}





// Supprimer une variante de Firestore
deleteVariant(id: string): Promise<void> {
  const variantDocRef = doc(this.firestore, `variants/${id}`); // Référence au document à supprimer

  return deleteDoc(variantDocRef)
    .then(() => {
      console.log('Variante supprimée avec succès');
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression de la variante :', error);
    });
}

  


// Dans le service VariantTypeService
// Méthode pour récupérer toutes les variantes
getVariants(): Observable<Variant[]> {
  const variantCollection = collection(this.firestore, 'variants');
  return collectionData(variantCollection, { idField: 'id' }) as Observable<Variant[]>;
}


  

}
