import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AddupdatevarianteComponent } from '../Mes formulaires/addupdatevariante/addupdatevariante.component';
import { VariantTypeService } from '../Services/variant-type.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Variant } from '../Interface/variant';


@Component({
  selector: 'app-variante',
  standalone: true,
  imports: [MatIconModule,
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginator,
    FormsModule,
    NgFor,
    NgIf],
  templateUrl: './variante.component.html',
  styleUrl: './variante.component.css'
})
export class VarianteComponent {
deleteVariantType(arg0: any,arg1: any) {
throw new Error('Method not implemented.');
}

filterelement($event: Event) {
throw new Error('Method not implemented.');
}


selectedVariantTypeId: string = ''; // Pour stocker l'ID de la variante-type sélectionnée
  newVariantName: string = ''; // Pour stocker le nom de la nouvelle variante
  variants: any[] = []; // Variantes avec le nom de variantType inclus
  variantTypes: any[] = []; // Pour stocker les types de variantes
  // variants: string[] = []; // Tableau pour stocker les variantes
  // variants: Variant[] = []; // Typage explicite de l'array `variants`
  variantTypesMap: { [id: string]: string } = {}; // Mapping entre variantTypeId et nom
  filteredVariants: any[] = [];


  constructor(private variantTypeService: VariantTypeService, private dialog: MatDialog,  private snackBar: MatSnackBar) {
    this.getVariantTypes(); 
    this.getAllData(); 
  }

  // Méthode pour charger les types de variantes
  getVariantTypes() {
    this.variantTypeService.getVariantTypes().subscribe(data => {
      this.variantTypes = data;
    });
  }

  // Méthode pour récupérer toutes les données nécessaires (variantes et types de variantes)
  getAllData() {
    this.variantTypeService.getVariantTypes().subscribe(variantTypes => {
      // Créer un mapping entre l'id de variantType et son nom
      this.variantTypesMap = {};
      variantTypes.forEach(variantType => {
        this.variantTypesMap[variantType.id] = variantType.nom;
      });

      // Récupérer les variantes
      this.variantTypeService.getVariants().subscribe(variants => {
        // Associer chaque variante avec le nom de son type
        this.variants = variants.map(variant => {
          return {
            ...variant,
            variantTypeNom: this.variantTypesMap[variant.variantTypeId], // Associer le nom du type de variante
            createdAt: variant.createdAt ? variant.createdAt.toDate() : null
          };
        });
        // this.filteredCategories = this.categories;
        this.filteredVariants = this.variants; 
      });
    });
  }
  
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredVariants = this.variants.filter(variants =>
      variants.nom.toLowerCase().includes(searchTerm)
    );
  }



  // Méthode pour ouvrir le dialog et ajouter une nouvelle variante
  ajoutervariante() {
    const dialogRef = this.dialog.open(AddupdatevarianteComponent, {
      width: '600px',  // Taille du dialog
      data: {}  // Pas de données initiales pour l'ajout
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si le formulaire a été soumis avec succès, appeler le service pour ajouter la variante
        this.variantTypeService.addVariant(result.variantTypeId, result.nom)
          .then(() => {
            console.log('Variante ajoutée avec succès');
          })
          .catch(error => {
            console.error('Erreur lors de l\'ajout de la variante :', error);
          });
      }
    });
  }













  // Méthode pour ajouter une variante à la variante-type sélectionnée
 
  addVariant(): void {
    if (this.selectedVariantTypeId && this.newVariantName) {
      this.variantTypeService.addVariant(this.selectedVariantTypeId, this.newVariantName)
        .then(() => {
          console.log('Variante ajoutée avec succès');
          // this.resetForm(); // Réinitialiser le formulaire après ajout
        })
        .catch((error) => {
          console.error('Erreur lors de l\'ajout de la variante :', error);
        });
    } else {
      console.log('Formulaire incomplet');
    }
  }


  //  // Réinitialiser le formulaire après l'ajout
  //  resetForm(): void {
  //   this.selectedVariantTypeId = '';
  //   this.newVariantName = '';
  // }
  // Méthode pour modifier une variante
  modifierVariante(variant: any) {
    const dialogRef = this.dialog.open(AddupdatevarianteComponent, {
      width: '600px',
      data: { variant }  // Passer la variante à modifier au formulaire
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.variantTypeService.updateVariant(variant.id, result)
          .then(() => {
            this.showSnackBar('Variante modifiée avec succès', 'success');
            this.getVariantTypes();  // Rafraîchir la liste après modification
          })
          .catch(error => {
            this.showSnackBar('Erreur lors de la modification de la variante', 'error');
            console.error('Erreur lors de la modification de la variante :', error);
          });
      }
    });
  }

  // Méthode pour supprimer une variante
  supprimerVariante(variantId: string) {
    if (confirm('Voulez-vous vraiment supprimer cette variante ?')) {
      this.variantTypeService.deleteVariant(variantId)
        .then(() => {
          this.showSnackBar('Variante supprimée avec succès', 'success');
          this.getVariantTypes();  // Rafraîchir la liste après suppression
        })
        .catch(error => {
          this.showSnackBar('Erreur lors de la suppression de la variante', 'error');
          console.error('Erreur lors de la suppression de la variante :', error);
        });
    }
  }

  // Méthode pour afficher le Snackbar
  showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }



  


  

}






