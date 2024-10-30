import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SubcategoryService } from '../../Services/souscategory.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ajoutmodifiersouscat',
  standalone: true,
  imports: [CommonModule,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOption,
    MatDialogContent,
    MatSelectModule,
    MatIconModule,],
  templateUrl: './ajoutmodifiersouscat.component.html',
  styleUrl: './ajoutmodifiersouscat.component.css'
})
export class AjoutmodifiersouscatComponent implements OnInit {

  sousCategorieForm: FormGroup;
  isEditMode: boolean = false;
  subcategoryId: string | null = null;

  // Catégories statiques
  selectedCategoryId: string = ''; // Catégorie sélectionnée par l'utilisateur
  categories: any[] = []; // Liste des catégories récupérées de Firestore
  subcategory: any = {
    name: '',
    description: ''
  };


  ngOnInit() {
    this.loadCategories(); // Charger les catégories disponibles
  }

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

  async loadSubcategoryData(id: string) {
    const subcategory = await this.subcategoryService.getSubcategoryById(id);
    this.sousCategorieForm.patchValue({
      categorieId: subcategory.categorieId,
      nom: subcategory.nom
    });
  }



  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjoutmodifiersouscatComponent>,
    private subcategoryService: SubcategoryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    // Initialiser le formulaire
    this.sousCategorieForm = this.fb.group({
      categorieId: ['', Validators.required],  // Champ sélection de catégorie
      nom: ['', Validators.required]           // Champ nom de la sous-catégorie
    });

    // Si des données existent (mode édition)
    if (data && data.sousCategorie) {
      this.isEditMode = true;
      this.sousCategorieForm.patchValue({
        categorieId: data.sousCategorie.categorieId,
        nom: data.sousCategorie.nom
      });
    }
    
  }

  // Fermer le dialogue
  onClose(): void {
    this.dialogRef.close();
  }

  // Réinitialiser le formulaire
  onReset(): void {
    this.sousCategorieForm.reset();
  }

  // Enregistrer la sous-catégorie
  async onSave() {
    if (this.sousCategorieForm.valid) {
      const formData = this.sousCategorieForm.value;
  
      if (this.data.isEditMode) {
        // Ne pas inclure l'ID dans formData, renvoyer séparément
        this.dialogRef.close({ id: this.data.sousCategorie.id, ...formData });
      } else {
        this.dialogRef.close(formData); // Ajout sans ID
      }
    }
  }
  


  

  
}
























  