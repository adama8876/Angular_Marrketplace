import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { VariantTypeService } from '../../Services/variant-type.service';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-addupdatevariante',
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
  templateUrl: './addupdatevariante.component.html',
  styleUrl: './addupdatevariante.component.css'
})
export class AddupdatevarianteComponent {
  isEditMode = false;
  variantForm: FormGroup;
  variantTypes: any[] = [];  // Pour stocker les types de variantes

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddupdatevarianteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  // Injecter les données passées par le composant parent
    private variantTypeService: VariantTypeService  // Service pour récupérer les types de variantes
  ) {
    this.variantForm = this.fb.group({
      variantTypeId: ['', Validators.required],
      nom: ['', Validators.required]
    });

    // Charger les types de variantes au démarrage
    this.loadVariantTypes();

    // Si des données sont passées pour la modification (mode édition)
    if (data && data.variant) {
      this.isEditMode = true;
      this.variantForm.patchValue(data.variant);  // Pré-remplir le formulaire avec les données existantes
    }
  }

  // Méthode pour charger les types de variantes depuis Firestore
  loadVariantTypes() {
    this.variantTypeService.getVariantTypes().subscribe(data => {
      this.variantTypes = data;  // Charger les types de variantes dans le select
    });
  }

  onSave() {
    if (this.variantForm.valid) {
      const variantData = this.variantForm.value;
      // Fermer le dialog en renvoyant les données au composant parent
      this.dialogRef.close(variantData);
    }
  }

  onReset() {
    this.variantForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }

}
