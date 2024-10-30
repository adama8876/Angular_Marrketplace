import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AjoutmodifVartypeComponent } from '../Mes formulaires/ajoutmodif-vartype/ajoutmodif-vartype.component';
import { VariantTypeService } from '../Services/variant-type.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-variante-type',
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
  templateUrl: './variante-type.component.html',
  styleUrl: './variante-type.component.css'
})
export class VarianteTypeComponent {

filterelement($event: Event) {
throw new Error('Method not implemented.');
}

variantTypes: any[] = []; // Tableau pour stocker les types de variantes
newVariantName: string = ''; // Pour stocker le nom de la nouvelle variante
selectedVariantTypeId: string = ''; // Pour stocker l'ID de la variante type sélectionnée
variants: string[] = []; // Utilisez ici le type approprié


  constructor(private dialog: MatDialog, private variantTypeService: VariantTypeService, private snackBar: MatSnackBar) {
    this.getAllVariantTypes(); // Appeler cette méthode au démarrage pour charger les données
  }

  // Ouvrir le dialog pour ajouter ou modifier un type de variante
  openVariantTypeDialog(isEditMode: boolean = false, variantTypeData: any = null) {
    const dialogRef = this.dialog.open(AjoutmodifVartypeComponent, {
      width: '600px',
      data: { isEditMode, variantType: variantTypeData }
    });
  
    // Gestion du résultat après la fermeture du dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si on est en mode édition, l'ID doit être présent dans les résultats
        if (isEditMode && variantTypeData && variantTypeData.id) {
          result.id = variantTypeData.id; // Transférer l'ID pour l'édition
        }
        this.saveVariantType(result); // Enregistrer dans Firestore
      }
    });
  }
  

  // Sauvegarder ou mettre à jour un type de variante dans Firestore
  saveVariantType(variantTypeData: any) {
    if (variantTypeData.id) {
      // Mettre à jour si l'ID est présent (édition)
      this.variantTypeService.updateVariantType(variantTypeData.id, {
        nom: variantTypeData.nom,
        type: variantTypeData.type
      })
      .then(() => {
        this.snackBar.open('Type de variante mis à jour avec succès', 'Fermer', { duration: 3000 });
        this.getAllVariantTypes(); // Recharger la liste
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour:', error);
      });
    } else {
      // Ajouter un nouveau type de variante
      this.variantTypeService.addVariantType(variantTypeData)
        .then(() => {
          this.snackBar.open('Type de variante ajouté avec succès', 'Fermer', { duration: 3000 });
          this.getAllVariantTypes(); // Recharger la liste
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout:', error);
        });
    }
  }
  

  // Obtenir tous les types de variantes depuis Firestore
  // Obtenir tous les types de variantes depuis Firestore
  getAllVariantTypes() {
    this.variantTypeService.getVariantTypes().subscribe(data => {
      this.variantTypes = data.map(variantType => {
        return {
          ...variantType,
          createdAt: variantType.createdAt ? variantType.createdAt.toDate() : null
        };
      });
    });
  }
  
  

  // Supprimer un type de variante
  deleteVariantType(id: string, variantTypeName: string) {
    const confirmDelete = confirm(`Voulez-vous vraiment supprimer le type de variante "${variantTypeName}" ?`);
  
    if (confirmDelete) {
      this.variantTypeService.deleteVariantType(id)
        .then(() => {
          this.snackBar.open('Type de variante supprimé avec succès', 'Fermer', { duration: 3000 });
          this.getAllVariantTypes(); // Recharger la liste
        })
        .catch(error => {
          console.error('Erreur lors de la suppression:', error);
        });
    }
  }





}
