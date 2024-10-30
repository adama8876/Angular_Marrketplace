import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../Services/commande_service.ts/commande.service';
import { Commandes } from '../Interface/variant';
import { AuthService } from '../Services/auth.service';
import { CommandeDialoComponent } from '../dialog/product-dialog/CommandeDetails/commande-dialo/commande-dialo.component';
import { ProductService } from '../Services/prouct.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [MatIconModule,
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    MatPaginator,
    NgFor,
    NgIf],
  templateUrl: './commandes.component.html',
  styleUrl: './commandes.component.css'
})
export class CommandesComponent {
filterByStatus($event: Event) {
throw new Error('Method not implemented.');
}
filterelement($event: Event) {
throw new Error('Method not implemented.');
}


orders: Commandes[] = []; 
userRole: string | null = null;

constructor(
  private orderService: OrderService, 
  private authService: AuthService, 
  private dialog: MatDialog, 
  private productService: ProductService
) {}

async ngOnInit(): Promise<void> { // Correction ici
  // Récupère le rôle de l'utilisateur connecté
  const role = await this.authService.fetchUserRole();
  this.userRole = role;
  console.log("User Role:", this.userRole); // Affiche le rôle pour vérification

  if (this.userRole === 'admin') {
      this.loadAllOrders();
  } else if (this.userRole === 'vendeur') {
      const currentUser = this.authService.getCurrentUser(); 
      if (currentUser) {
          this.loadOrdersForVendor(currentUser.uid);
      } else {
          console.warn("Utilisateur non trouvé pour le rôle 'vendeur'");
      }
  } else {
      console.warn("Utilisateur sans rôle valide");
  }
}




loadAllOrders(): void {
  this.orderService.getOrders().subscribe(async (orders) => {
    console.log("Commandes récupérées pour l'admin:", orders);

    this.orders = await Promise.all(orders.map(async (order) => {
      const user = await this.authService.fetchUserData(order.userId); 
      return {
        ...order,
        userEmail: user ? user.email : 'Email non disponible', 
        userPhone: user ? user.telephone : 'Contact non disponible'
      };
    }));
    console.log("Commandes après ajout des données utilisateur:", this.orders);
  });
}

loadOrdersForVendor(vendorId: string): void {
  this.orderService.getOrders().subscribe(async (orders) => {
    console.log("Commandes récupérées pour le vendeur:", orders);

    // Tableau pour stocker les commandes filtrées pour le vendeur
    const vendorOrders = [];

    // Boucle à travers chaque commande
    for (const order of orders) {
      // console.log("Vérification de la commande:", order); // Détails de la commande
      
      // Boucle à travers chaque produit dans la commande
      for (const item of order.items) {
        // console.log("Vérification du produit dans la commande:", item); // Détails de chaque produit
        
        // Vérifie si le produit a été ajouté par le vendeur
        const isAddedByVendor = await this.orderService.isProductAddedByVendor(item.productId, vendorId);
        // console.log(`Produit ID: ${item.productId}, Ajouté par le vendeur: ${isAddedByVendor}`); // Résultat de la vérification
        
        // Si au moins un produit est ajouté par le vendeur, on ajoute la commande au tableau
        if (isAddedByVendor) {
          vendorOrders.push(order);
          break; // Sortir de la boucle une fois qu'un produit valide est trouvé
        }
      }
    }

    // console.log("Commandes filtrées pour le vendeur:", vendorOrders);

    // Ajoute les informations utilisateur (email et téléphone) pour chaque commande filtrée
    this.orders = await Promise.all(vendorOrders.map(async (order) => {
      const user = await this.authService.fetchUserData(order.userId);
      return {
        ...order,
        userEmail: user ? user.email : 'Email non disponible',
        userPhone: user ? user.telephone : 'Contact non disponible'
      };
    }));

    console.log("Commandes après ajout des données utilisateur pour le vendeur:", this.orders);
  });
}




openDialog(order: Commandes): void {
  const dialogRef = this.dialog.open(CommandeDialoComponent, {
    width: '80vw',
    height: '90vh',
    data: order,
    panelClass: 'custom-dialog-container',
  });

  dialogRef.afterClosed().subscribe(result => {
    // Action après la fermeture du dialog si nécessaire
  });
}
}

