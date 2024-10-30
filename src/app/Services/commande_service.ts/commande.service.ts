import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, arrayUnion, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Commandes } from '../../Interface/variant';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firestore: Firestore) {}

  getOrders(): Observable<Commandes[]> {
    const orderCollection = collection(this.firestore, 'orders');
    return collectionData(orderCollection, { idField: 'id' }) as Observable<Commandes[]>;
  }

  async updateItemStatus(orderId: string, productId: string, newStatus: string): Promise<void> {
    const orderRef = doc(this.firestore, `orders/${orderId}`);
    const orderDoc = await getDoc(orderRef);

    if (orderDoc.exists()) {
        const orderData = orderDoc.data() as Commandes;
        const updatedItems = orderData.items.map(item => {
            if (item.productId === productId) {
                return { ...item, status: newStatus };
            }
            return item;
        });

        // Vérifiez le statut général
        const allItemsStatus = updatedItems.map(item => item.status);
        const newGlobalStatus = this.calculateGlobalStatus(allItemsStatus);

        // Mettez à jour la commande avec les nouveaux éléments et le nouveau statut global
        await updateDoc(orderRef, { items: updatedItems, status: newGlobalStatus });
        console.log('Commande mise à jour avec succès', updatedItems);
    } else {
        console.error('Document non trouvé:', orderId);
    }
}

// Méthode pour calculer le statut global
private calculateGlobalStatus(itemsStatus: string[]): string {
    
    if (itemsStatus.every(status => status === 'livré')) {
        return 'terminé';
    }

    
    if (itemsStatus.some(status => status === 'en traitement')) {
        return 'en traitement';
    }

    // Sinon, retourner "en attente" par défaut
    return 'en traitement';
}






 // Méthode pour vérifier si un produit a été ajouté par un vendeur spécifique
 async isProductAddedByVendor(productId: string, vendorId: string): Promise<boolean> {
  console.log(`Vérification du produit ID: ${productId} pour le vendeur ID: ${vendorId}`); // Console pour voir les IDs

  const productRef = doc(this.firestore, `products/${productId}`);
  const productDoc = await getDoc(productRef);

  if (productDoc.exists()) {
    const productData = productDoc.data();
    console.log(`Produit trouvé:`, productData); // Console pour afficher les données du produit
    const isAddedByVendor = productData['addedBy'] === vendorId; // Comparaison avec le vendeur
    console.log(`Produit ajouté par le vendeur? ${isAddedByVendor}`); // Résultat de la vérification
    return isAddedByVendor;
  } else {
    console.error('Produit non trouvé:', productId);
    return false;
  }
}



}
