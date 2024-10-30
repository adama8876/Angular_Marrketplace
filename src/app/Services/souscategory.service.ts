import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, DocumentReference, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  constructor(private firestore: Firestore) {}

   // Méthode pour créer une sous-catégorie
     // Méthode pour ajouter une nouvelle sous-catégorie
  async addSubcategory(subcategoryData: any): Promise<DocumentReference> {
    const subcategoriesRef = collection(this.firestore, 'subcategories');
    
    // Ajout de la date de création
    const dataWithDate = {
      ...subcategoryData,
      dateAjout: new Date()
    };
    
    return addDoc(subcategoriesRef, dataWithDate);
  }

  // Méthode pour modifier une sous-catégorie existante
  // async updateSubcategory(id: string, updatedData: any): Promise<void> {
  //   const subcategoryDocRef = doc(this.firestore, `subcategories/${id}`);
  //   return updateDoc(subcategoryDocRef, updatedData);
  // }

  async updateSubcategory(subcategoryId: string, updatedData: any): Promise<void> {
    const subcategoryDocRef = doc(this.firestore, `subcategories/${subcategoryId}`);
    await updateDoc(subcategoryDocRef, updatedData);
  }

  // Méthode pour récupérer une sous-catégorie par ID
  async getSubcategoryById(id: string): Promise<any> {
    const subcategoryDocRef = doc(this.firestore, `subcategories/${id}`);
    const docSnap = await getDoc(subcategoryDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('La sous-catégorie n\'existe pas');
    }
  }
  

 
  async getAllSubcategories(): Promise<any[]> {
    const subcategoriesRef = collection(this.firestore, 'subcategories');
    const querySnapshot = await getDocs(subcategoriesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

 
   // Méthode pour supprimer une sous-catégorie
   async deleteSubcategory(id: string): Promise<void> {
    const subcategoryDocRef = doc(this.firestore, `subcategories/${id}`);
    
    // Suppression du document
    return deleteDoc(subcategoryDocRef);
  }

  // Méthode pour récupérer toutes les catégories (avec images)
  async getCategoriesWithImages(): Promise<any[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    
    // Transformation des documents en un tableau d'objets
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }





  async getCategoryById(categoryId: string): Promise<any> {
    const categoryDocRef = doc(this.firestore, `categories/${categoryId}`);
    const docSnap = await getDoc(categoryDocRef);
  
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('La catégorie n\'existe pas');
    }
  }
  
}
