import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CategoryService } from './../../Services/category.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

import { finalize } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ajoutmodifiercategorie',
  templateUrl: './ajoutmodifiercategorie.component.html',
  styleUrls: ['./ajoutmodifiercategorie.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AngularFireStorageModule,
    NgIf
    
  ]
})
export class AjoutModifierCategorieComponent {
  categoryForm: FormGroup;
  isEditMode: boolean = false;
  imagePreview: string | ArrayBuffer | null = null; // Pour stocker l'aperçu de l'image

  constructor(
    public dialogRef: MatDialogRef<AjoutModifierCategorieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // Initialisation du formulaire
    this.categoryForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      image: [null, Validators.required]
    });

    // Vérifier si on est en mode édition
    this.isEditMode = !!data?.name;
  }

  // Gestion de la sélection d'image et génération de l'aperçu
  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.categoryForm.patchValue({ image: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Stocker l'aperçu de l'image
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value); // Ferme le modal et renvoie les données du formulaire
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Ferme sans enregistrer
  }
  
}
