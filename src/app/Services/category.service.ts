import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { DocumentReference } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private firestore: Firestore, private storage: Storage) {}

  // Fonction pour uploader une image dans Firebase Storage et enregistrer l'URL dans Firestore
  async addCategoryWithImage(categoryName: string, image: File): Promise<DocumentReference> {
    const imageRef = ref(this.storage, `categories/${image.name}`);
    
    // Upload de l'image dans Storage
    const snapshot = await uploadBytes(imageRef, image);
    
    // Récupération de l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Ajout des données dans Firestore avec l'URL de l'image et la date d'ajout
    const categoriesRef = collection(this.firestore, 'categories');
    const creationDate = new Date(); // Obtient la date et l'heure actuelles
    
    return addDoc(categoriesRef, { 
      name: categoryName, 
      imageUrl: downloadURL, 
      createdAt: creationDate // Ajout de la date de création
    });
  }

  // Nouvelle méthode pour récupérer les catégories et afficher leurs images
  async getCategoriesWithImages(): Promise<any[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    
    // Transformation des documents en un tableau d'objets
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Retourne les catégories avec leur nom et imageUrl
    return categories;
  }



  // -----------------------------------------------------------------------------------


  // -------------------- Fonction pour modifier une catégorie avec une image --------------------
  
  async editCategoryWithImage(categoryId: string, updatedCategoryName: string, newImage?: File): Promise<void> {
    const categoryDocRef = doc(this.firestore, 'categories', categoryId);

    // Si une nouvelle image est fournie, la télécharger et récupérer l'URL
    if (newImage) {
      const imageRef = ref(this.storage, `categories/${newImage.name}`);
      const snapshot = await uploadBytes(imageRef, newImage);
      const newImageUrl = await getDownloadURL(snapshot.ref);

      // Mise à jour du document avec la nouvelle image
      await updateDoc(categoryDocRef, {
        name: updatedCategoryName,
        imageUrl: newImageUrl
      });
    } else {
      // Mise à jour uniquement du nom sans changement d'image
      await updateDoc(categoryDocRef, {
        name: updatedCategoryName
      });
    }
  }
  

  // -------------------- Fonction pour supprimer une catégorie et son image --------------------
  
  async deleteCategoryWithImage(categoryId: string, imageUrl: string): Promise<void> {
    const categoryDocRef = doc(this.firestore, 'categories', categoryId);

    // Supprimer l'image associée dans Firebase Storage
    const imageRef = ref(this.storage, imageUrl);
    await deleteObject(imageRef);

    // Supprimer le document de la catégorie dans Firestore
    await deleteDoc(categoryDocRef);
  }








  // Ajoutez cette méthode dans `CategoryService`
getCategoriesCount(): Observable<number> {
  const categoriesRef = collection(this.firestore, 'categories');
  return collectionData(categoriesRef).pipe(
    map((categories: any[]) => categories.length) // Compter le nombre de catégories
  );
}








}
