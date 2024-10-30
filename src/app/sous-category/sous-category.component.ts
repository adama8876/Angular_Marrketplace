import { Component, OnInit } from '@angular/core';
import { SubcategoryService } from '../Services/souscategory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { AjoutmodifiersouscatComponent } from '../Mes formulaires/ajoutmodifiersouscat/ajoutmodifiersouscat.component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../Services/auth.service';



@Component({
  selector: 'app-sous-category',
  standalone: true,
  imports: [FormsModule,CommonModule,MatPaginator,DialogModule],
  templateUrl: './sous-category.component.html',
  styleUrl: './sous-category.component.css'
})
export class SousCategoryComponent implements OnInit{
filterelement($event: Event) {
throw new Error('Method not implemented.');
}

editCategory(arg0: number) {
throw new Error('Method not implemented.');
}
deleteCategory(arg0: number) {
throw new Error('Method not implemented.');


}
opendialog(isEditMode: boolean = false, sousCategorieData: any = null): void {
  const dialogRef = this.dialog.open(AjoutmodifiersouscatComponent, {
    width: '600px',
    data: {
      isEditMode: isEditMode,
      sousCategorie: sousCategorieData,  // Vérifie que sousCategorieData contient bien un ID
      categories: this.categories,  // Passer les catégories récupérées
    },
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (isEditMode) {
        const { id, ...updatedData } = result;  // Séparer l'ID des autres données
        this.subcategoryService.updateSubcategory(id, updatedData)  // Utiliser l'ID pour identifier le document
          .then(() => {
            this.snackBar.open('Sous-catégorie modifiée avec succès', 'Fermer', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['custom-snackbar']
            });
            this.loadSubcategories();  // Recharger les sous-catégories après la modification
          })
          .catch(error => {
            this.snackBar.open(`Erreur lors de la modification: ${error.message}`, 'Fermer', {
              duration: 3000,
            });
          });
      } else {
        this.subcategoryService.addSubcategory(result)
          .then(() => {
            this.snackBar.open('Sous-catégorie ajoutée avec succès', 'Fermer', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['custom-snackbar']
            });
            this.loadSubcategories();  // Recharger les sous-catégories après l'ajout
          })
          .catch((error) => {
            this.snackBar.open(`Erreur lors de l'ajout: ${error.message}`, 'Fermer', {
              duration: 3000,
            });
          });
      }
    } else {
      console.log('Dialog fermé sans action.');
    }
  });
}



userRole: string | null = null;

subcategories: any[] = []; // Variable pour stocker les sous-catégories
selectedCategoryId: string = ''; // Catégorie sélectionnée par l'utilisateur
  categories: any[] = []; // Liste des catégories récupérées de Firestore
  subcategory: any = {
    name: '',
  };  // Objet pour les données de la sous-catégorie

  constructor(private subcategoryService: SubcategoryService,public dialog: MatDialog, private snackBar: MatSnackBar,private authService: AuthService) {}

  ngOnInit() {
    // this.loadCategories(); // Charger les catégories disponibles
    // this.loadSubcategories();
     // Charger d'abord les catégories puis les sous-catégories
  this.loadCategories().then(() => {
    this.loadSubcategories();
  });
  this.authService.userRole$.subscribe(role => {
    this.userRole = role; // Récupère et stocke le rôle de l'utilisateur
  });
  }

  loadSubcategories() {
    this.subcategoryService.getAllSubcategories()
      .then((subcategories) => {
        this.subcategories = subcategories.map(subcategory => {
          const category = this.categories.find(cat => cat.id === subcategory.categorieId);
          return {
            ...subcategory,
            categoryName: category ? category.name : 'Catégorie inconnue',
            // Conversion de 'dateAjout' en 'Date' si elle existe
            dateAjout: subcategory.dateAjout ? subcategory.dateAjout.toDate() : null
          };
        });
      })
      .catch((error) => {
        this.snackBar.open(`Erreur lors de la récupération des sous-catégories: ${error.message}`, 'Fermer', {
          duration: 3000,
        });
      });
  }
  
  

  

  // Charger les catégories depuis Firestore pour remplir le select
  async loadCategories() {
    try {
      const categoriesFromFirestore = await this.subcategoryService.getCategoriesWithImages();
      this.categories = categoriesFromFirestore.map(category => {
        return {
          ...category,
          name: category.name ? category.name : null  // S'assurer que le nom est disponible
        };
      });
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  }

  // Ajouter une sous-catégorie avec la catégorie sélectionnée
  addSubcategory() {
    if (this.selectedCategoryId && this.subcategory.name) {
      // Ajouter l'ID de la catégorie sélectionnée aux données de la sous-catégorie
      const subcategoryData = {
        ...this.subcategory,
        categoryId: this.selectedCategoryId // Lier la sous-catégorie à la catégorie sélectionnée
      };
  
      // Ajouter la sous-catégorie dans Firestore
      this.subcategoryService.addSubcategory(subcategoryData)
        .then(() => {
          this.snackBar.open('Sous-catégorie ajoutée avec succès', 'Fermer', {
            duration: 3000, 
            verticalPosition: 'top',
            panelClass: ['custom-snackbar']
          });
  
          // Recharger les sous-catégories pour afficher la nouvelle entrée
          this.loadSubcategories();
        })
        .catch(error => {
          this.snackBar.open(`Erreur: ${error.message}`, 'Fermer', {
            duration: 3000,
          });
        });
    }
  }
  

  updateSubcategory(subcategoryId: string) {
    const subcategoryToEdit = this.subcategories.find(subcategory => subcategory.id === subcategoryId);
  
    if (subcategoryToEdit) {
      this.opendialog(true, subcategoryToEdit); // Passe en mode édition avec les données de la sous-catégorie
    }
  }
  




  onDelete(sousCategorieId: string, subcategoryName: string) {
    // Demande de confirmation avant suppression
    const confirmDelete = confirm(`Voulez-vous vraiment supprimer la sous-catégorie "${subcategoryName}" ?`);
    
    // Si l'utilisateur confirme la suppression
    if (confirmDelete) {
      this.subcategoryService.deleteSubcategory(sousCategorieId).then(() => {
        this.snackBar.open('Sous-catégorie supprimée avec succès', 'Fermer', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar']
        });
        this.loadSubcategories(); // Recharge la liste des sous-catégories après suppression
      }).catch((error) => {
        this.snackBar.open(`Erreur lors de la suppression: ${error.message}`, 'Fermer', {
          duration: 3000,
        });
        console.error('Erreur lors de la suppression de la sous-catégorie :', error);
      });
    } else {
      // Si l'utilisateur annule
      console.log('Suppression annulée');
    }
  }
  

}
