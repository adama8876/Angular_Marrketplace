import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgFor, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductDialogComponent } from '../dialog/product-dialog/product-dialog.component';
import { ProductService } from '../Services/prouct.service';
import { CategoryService } from '../Services/category.service';
import { SubcategoryService } from '../Services/souscategory.service';
import { VariantTypeService } from '../Services/variant-type.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { TruncatePipe } from './truncate.pipe';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [MatIconModule,  TruncatePipe ,MatButtonModule, MatTableModule, MatDialogModule, MatPaginator, FormsModule, NgFor, NgIf, MatFormField,MatLabel],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
filterelement($event: Event) {
throw new Error('Method not implemented.');
}
  displayedColumns: string[] = ['id', 'image', 'name', 'price', 'quantity', 'subCategory', 'action'];
  dataSource = new MatTableDataSource<any>([]); // Utilisation de MatTableDataSource pour les données
  userRole: string | null = null;
  categories: any[] = [];
  subCategories: any[] = [];
  variantTypes: any[] = [];
  filterValue: string = '';

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private snackBar: MatSnackBar,
    private variantTypeService: VariantTypeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Récupérer le rôle de l'utilisateur
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
      this.loadProducts(); // Charger les produits en fonction du rôle
    });
  
    // Charger les catégories, sous-catégories et types de variantes
    this.loadCategories();
    this.loadVariantTypes();
  }

  // Charger les catégories
  loadCategories(): void {
    this.categoryService.getCategoriesWithImages().then(categories => {
      this.categories = categories;
    });
  }

  // Charger les types de variantes
  loadVariantTypes(): void {
    this.variantTypeService.getVariantTypes().subscribe(variantTypes => {
      this.variantTypes = variantTypes;
    });
  }

  // Méthode pour appliquer le filtre
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // Méthode pour ouvrir le formulaire dans un dialog pour ajouter un produit
  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '1000px',
      height: '600px',
      maxWidth: '90vw',
      data: {
        categories: this.categories,
        subCategories: this.subCategories,
        variantTypes: this.variantTypes
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts(); // Recharger la liste des produits après ajout
      }
    });
  }

  // Méthode pour ouvrir le formulaire dans un dialog pour modifier un produit
  openEditProductDialog(product: any): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '1000px',
      height: '600px',
      maxWidth: '90vw',
      data: {
        product,
        categories: this.categories,
        subCategories: this.subCategories,
        variantTypes: this.variantTypes
      }
    });

    dialogRef.afterClosed().subscribe(updatedProductData => {
      if (updatedProductData) {
        const {
          productName,
          price,
          quantity,
          description,
          category,
          subCategory,
          mainImageUrl,
          secondImageUrl,
          thirdImageUrl,
          fourthImageUrl,
          variantItem
        } = updatedProductData;

        // Appelle la méthode updateProduct du service
        this.productService.updateProduct(product.id, {
          productName,
          price,
          quantity,
          description,
          categoryId: category,
          subcategoryId: subCategory,
          mainImageUrl: mainImageUrl || null,
          secondImageUrl: secondImageUrl || null,
          thirdImageUrl: thirdImageUrl || null,
          fourthImageUrl: fourthImageUrl || null,
          variantData: variantItem || []
        })
        .then(() => {
          console.log('Produit mis à jour avec succès');
          this.loadProducts(); // Rechargez la liste des produits après la mise à jour
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour du produit :', error);
          this.snackBar.open('Erreur lors de la mise à jour du produit', 'Fermer', { duration: 3000 });
        });
      }
    });
  }

 
  // Charger les produits en fonction du rôle de l'utilisateur
loadProducts(): void {
  const user = this.authService.getCurrentUser(); // Récupérer l'utilisateur actuel
  console.log('Utilisateur actuel:', user); // Vérification de l'utilisateur
  console.log('Rôle utilisateur:', this.userRole); // Vérification du rôle de l'utilisateur

  if (this.userRole === 'admin') {
    console.log('Rôle admin détecté, chargement de tous les produits');
    this.productService.getProducts().subscribe(products => {
      products = products.map((product, index) => ({
        ...product,
        order: index + 1 // Ajouter l'ordre, commence à 1
      }));
      this.dataSource.data = products;
      console.log('Produits chargés pour admin:', products); // Vérification des produits pour admin
    }, error => {
      console.error('Erreur lors du chargement des produits :', error);
      this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 3000 });
    });
  } else if (this.userRole === 'vendeur' && user) {
    console.log('Rôle vendeur détecté, chargement des produits pour l\'utilisateur:', user.uid);
    this.productService.getProductsByUser(user.uid).subscribe(products => {
      products = products.map((product, index) => ({
        ...product,
        order: index + 1 // Ajouter l'ordre, commence à 1
      }));
      this.dataSource.data = products;
      console.log('Produits chargés pour vendeur:', products); // Vérification des produits pour vendeur
    }, error => {
      console.error('Erreur lors du chargement des produits :', error);
      this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 3000 });
    });
  } else {
    console.warn('Rôle utilisateur non reconnu ou utilisateur non connecté');
  }
}


  // Méthode pour supprimer un produit
  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).then(() => {
      this.snackBar.open('Produit supprimé avec succès', 'Fermer', { duration: 3000 });
      this.loadProducts(); // Recharger la liste des produits après suppression
    }).catch(error => {
      console.error('Erreur lors de la suppression du produit :', error);
      this.snackBar.open('Erreur lors de la suppression du produit', 'Fermer', { duration: 3000 });
    });
  }
}







 
  























// productName: string = '';
// price: number = 0;
// quantity: number = 0;
// description: string = '';
// categoryId: string = '';
// subcategoryId: string = '';
// mainImage: File | null = null;
// secondImage: File | null = null;
// thirdImage: File | null = null;
// fourthImage: File | null = null;
// selectedVariants: string[] = [];
// variantTypeId: string = '';
// variantTypes: any[] = [];
// categories: any[] = [];
// subcategories: any[] = [];
// variants: any[] = [];

// constructor(
//   private productService: ProductService,
//   private categoryService: CategoryService,
//   private subcategoryService: SubcategoryService,
//   private variantTypeService: VariantTypeService,
//   private dialog: MatDialog,
// ) {}

// ngOnInit(): void {
//   // Charger les catégories et types de variantes
//   this.categoryService.getCategoriesWithImages().then((categories) => {
//     this.categories = categories;
//     console.log('Catégories chargées:', this.categories);
//   });

  
//   this.variantTypeService.getVariantTypes().subscribe((variantTypes) => {
//     this.variantTypes = variantTypes;
//     console.log('Variantes-types chargées:', this.variantTypes); // Vérification des données
//   });
// }

// // Charger les sous-catégories en fonction de la catégorie sélectionnée
// onCategoryChange(): void {
//   console.log('Catégorie sélectionnée:', this.categoryId);
//   this.subcategoryService.getAllSubcategories().then((subcategories) => {
//     console.log('Toutes les sous-catégories récupérées:', subcategories);
//     subcategories.forEach(sub => console.log(`Sous-catégorie: ${sub.nom}, Category ID: ${sub.categorieId}`));
//     this.subcategories = subcategories.filter(sub => sub.categorieId === this.categoryId); // Utilisation de categorieId
//     console.log('Sous-catégories filtrées:', this.subcategories);
    
//     if (this.subcategories.length === 0) {
//       console.warn('Aucune sous-catégorie disponible pour cette catégorie.');
//     }
//   }).catch(error => {
//     console.error('Erreur lors de la récupération des sous-catégories:', error);
//   });
// }

// // Charger les variantes en fonction du type de variante sélectionné
// onVariantTypeChange(): void {
//   console.log('Type de variante sélectionné:', this.variantTypeId);
//   this.variantTypeService.getVariants().subscribe((variants) => {
//     console.log('Toutes les variantes récupérées:', variants);
//     this.variants = variants.filter(variant => variant.variantTypeId === this.variantTypeId);
//     console.log('Variantes filtrées:', this.variants);

//     if (this.variants.length === 0) {
//       console.warn('Aucune variante disponible pour ce type de variante.');
//     }
//   }, error => {
//     console.error('Erreur lors de la récupération des variantes:', error);
//   });
// }


// // Méthode pour gérer la sélection des variantes avec les cases à cocher
// onVariantCheckboxChange(event: any, variantId: string): void {
//   if (event.target.checked) {
//     this.selectedVariants.push(variantId);
//   } else {
//     this.selectedVariants = this.selectedVariants.filter(id => id !== variantId);
//   }
//   console.log('Variantes sélectionnées:', this.selectedVariants);
// }

// // Méthode pour gérer la sélection de l'image principale
// onMainImageSelected(event: any): void {
//   this.mainImage = event.target.files[0];
//   console.log('Image principale sélectionnée:', this.mainImage);
// }

// // Méthode pour gérer la sélection de la deuxième image (optionnelle)
// onSecondImageSelected(event: any): void {
//   this.secondImage = event.target.files[0] || null;
//   console.log('Deuxième image sélectionnée:', this.secondImage);
// }

// // Méthode pour gérer la sélection de la troisième image (optionnelle)
// onThirdImageSelected(event: any): void {
//   this.thirdImage = event.target.files[0] || null;
//   console.log('Troisième image sélectionnée:', this.thirdImage);
// }

// // Méthode pour gérer la sélection de la quatrième image (optionnelle)
// onFourthImageSelected(event: any): void {
//   this.fourthImage = event.target.files[0] || null;
//   console.log('Quatrième image sélectionnée:', this.fourthImage);
// }

// // Méthode appelée lors de la soumission du formulaire
// async onSubmit(): Promise<void> {
//   if (this.mainImage) {
//     const variantData = this.selectedVariants;

//     try {
//       // Upload des images
//       const mainImageUrl = await this.productService.uploadImage(this.mainImage, 'products/main');
//       const secondImageUrl = this.secondImage ? await this.productService.uploadImage(this.secondImage, 'products/second') : null;
//       const thirdImageUrl = this.thirdImage ? await this.productService.uploadImage(this.thirdImage, 'products/third') : null;
//       const fourthImageUrl = this.fourthImage ? await this.productService.uploadImage(this.fourthImage, 'products/fourth') : null;

//       // Ajouter le produit avec les images
//       await this.productService.addProduct(
//         this.productName,
//         this.price,
//         this.quantity,
//         this.description,
//         this.categoryId,
//         this.subcategoryId,
//         mainImageUrl,
//         secondImageUrl,
//         thirdImageUrl,
//         fourthImageUrl,
//         variantData
//       );

//       console.log('Produit ajouté avec succès');
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout du produit :', error);
//     }
//   } else {
//     console.error('L\'image principale est requise.');
//   }
// }