import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-ajoutmodif-vartype',
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
  templateUrl: './ajoutmodif-vartype.component.html',
  styleUrl: './ajoutmodif-vartype.component.css'
})
export class AjoutmodifVartypeComponent {
  variantTypeForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjoutmodifVartypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data?.isEditMode || false;

    this.variantTypeForm = this.fb.group({
      nom: ['', Validators.required],
      type: ['', Validators.required]
    });

    if (this.isEditMode) {
      this.loadVariantTypeData(data.variantType); // Remplir le formulaire si mode édition
    }
  }

  loadVariantTypeData(variantType: any) {
    this.variantTypeForm.patchValue({
      nom: variantType.nom,
      type: variantType.type
    });
  }

  onSave() {
    if (this.variantTypeForm.valid) {
      const variantTypeData = this.variantTypeForm.value;
      // Sauvegarder les données
      this.dialogRef.close(variantTypeData);
    }
  }

  onReset() {
    this.variantTypeForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }

}
