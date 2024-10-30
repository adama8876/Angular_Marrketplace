import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../Services/category.service';
import { DocumentReference } from '@angular/fire/firestore'; // Import DocumentReference
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { AjoutModifierCategorieComponent } from '../Mes formulaires/ajoutmodifiercategorie/ajoutmodifiercategorie.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css'],
  imports: [FormsModule, NgIf, NgFor, MatPaginator, CommonModule],
  standalone: true
})
export class CategorieComponent implements OnInit {
  filterelement($event: Event) {
    throw new Error('Method not implemented.');
  }
  editCategory(arg0: any) {
    throw new Error('Method not implemented.');
  }
 

  categories: any[] = [];
  userRole: string | null = null;
  filteredCategories: any[] = []; 

  constructor(private categoryService: CategoryService, public dialog: MatDialog, private authService: AuthService) {}

  

  ngOnInit(): void {
    this.loadCategories();
    this.authService.userRole$.subscribe(role => {
      this.userRole = role; // Récupère et stocke le rôle de l'utilisateur
    });
  }

  async loadCategories() {
    try {
      const categoriesFromFirestore = await this.categoryService.getCategoriesWithImages();
      
      // Convertir chaque Timestamp en Date
      this.categories = categoriesFromFirestore.map(category => {
        return {
          ...category,
          createdAt: category.createdAt ? category.createdAt.toDate() : null // Conversion en Date
        };
      });
      this.filteredCategories = this.categories;
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  }
  

  // Ouvrir le formulaire pour ajouter une catégorie
  openAddCategoryForm(): void {
    const dialogRef = this.dialog.open(AjoutModifierCategorieComponent, {
      width: '400px',
      data: null // Pas de données pour l'ajout
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Logique pour ajouter une nouvelle catégorie
        this.categoryService.addCategoryWithImage(result.name, result.image)
          .then(() => this.loadCategories());
      }
    });
  }

  



  openEditCategoryForm(category: any): void {
    const dialogRef = this.dialog.open(AjoutModifierCategorieComponent, {
      width: '400px',
      data: category // Passer les données de la catégorie pour la modification
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la méthode pour modifier la catégorie
        this.categoryService.editCategoryWithImage(category.id, result.name, result.image)
          .then(() => this.loadCategories()); // Recharger les catégories après la modification
      }
    });
  }

  // -------------------- Supprimer une catégorie et son image --------------------
  deleteCategory(category: any): void {
    const confirmDelete = confirm(`Voulez-vous vraiment supprimer la catégorie "${category.name}" ?`);
    
    if (confirmDelete) {
      // Supprimer la catégorie avec l'image
      this.categoryService.deleteCategoryWithImage(category.id, category.imageUrl)
        .then(() => this.loadCategories()) // Recharger les catégories après la suppression
        .catch(error => console.error('Erreur lors de la suppression de la catégorie:', error));
    }
  }


  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm)
    );
  }
}
