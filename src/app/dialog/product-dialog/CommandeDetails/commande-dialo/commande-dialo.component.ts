import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Commandes } from '../../../../Interface/variant';
import { CommonModule, NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCommonModule } from '@angular/material/core';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../../../Services/commande_service.ts/commande.service';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-commande-dialo',
  standalone: true,
  imports: [NgFor, CommonModule,
    ReactiveFormsModule, // For reactive forms
    FormsModule, // Add this to use ngModel          
    MatDialogModule,
    MatCommonModule,
    MatList,
    MatListItem,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule, // Pour les selects (listes déroulantes)
    MatButtonModule
  ],
  templateUrl: './commande-dialo.component.html',
  styleUrls: ['./commande-dialo.component.css']
})
export class CommandeDialoComponent {
  vendorId: string | null = null;
  vendorProducts: any[] = []; // Stocker les produits du vendeur
  userRole: string | null = null; // Rôle de l'utilisateur

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Commandes,
    private dialogRef: MatDialogRef<CommandeDialoComponent>,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.vendorId = currentUser ? currentUser.uid : null;

    // Charger le rôle de l'utilisateur
    this.loadUserRole();
  }

  async loadUserRole() {
    this.userRole = await this.authService.fetchUserRole();
    this.loadVendorProducts();
  }

  async loadVendorProducts() {
    if (!this.vendorId) {
      console.warn("vendorId est null, impossible de récupérer les produits du vendeur.");
      return; // Retournez si vendorId est null
    }

    if (this.userRole === 'admin') {
      // Si l'utilisateur est un admin, afficher tous les produits
      this.vendorProducts = this.data.items; // Supposons que tous les produits sont dans data.items
    } else if (this.userRole === 'vendeur') {
      // Si l'utilisateur est un vendeur, afficher seulement ses produits
      const vendorProducts = [];
      for (const item of this.data.items) {
        const isAddedByVendor = await this.orderService.isProductAddedByVendor(item.productId, this.vendorId);
        if (isAddedByVendor) {
          vendorProducts.push(item);
        }
      }
      this.vendorProducts = vendorProducts; // Stocker les produits du vendeur
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onStatusChange(item: any): void {
    const userConfirmed = confirm('Êtes-vous sûr de vouloir changer le statut ? Cette action est irréversible.');

    if (userConfirmed) {
        console.log('Statut mis à jour:', item);
        this.orderService.updateItemStatus(this.data.id, item.productId, item.status)
            .then(() => {
                console.log('Statut mis à jour dans Firestore pour le produit:', item.productId);
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour du statut dans Firestore:', error);
            });
    } else {
        console.log('Changement de statut annulé.');
        // Remettre le statut précédent si nécessaire
    }
}


  updateOrderItemsStatus(): void {
    const updates = this.data.items.map(item => {
      console.log('Mise à jour du statut:', item.productId, 'avec le nouveau statut:', item.status);
      return this.orderService.updateItemStatus(this.data.id, item.productId, item.status);
    });

    // Exécuter toutes les promesses
    Promise.all(updates)
      .then(() => {
        console.log('Tous les statuts ont été mis à jour avec succès.');
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour des statuts:', error);
      });
  }







}
