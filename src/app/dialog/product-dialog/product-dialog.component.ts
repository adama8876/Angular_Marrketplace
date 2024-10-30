import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../Services/prouct.service';
import { CategoryService } from '../../Services/category.service';
import { SubcategoryService } from '../../Services/souscategory.service';
import { VariantTypeService } from '../../Services/variant-type.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,    // For reactive forms
  FormsModule,            // Add this to use ngModel          
    ReactiveFormsModule,    // Pour les formulaires réactifs
    MatDialogModule,        // Pour le dialog
    MatFormFieldModule,     // Pour les champs de formulaire Material
    MatInputModule,
    MatSelectModule, 
    MatCheckboxModule,       // Pour les selects (listes déroulantes)
    MatButtonModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {
  productForm!: FormGroup;
  selectedImages: string[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  variantTypes: any[] = [];
  selectedFiles: File[] = [];
  variantItems: any[] = [];
  isEditMode: boolean = false;
  // variantGroups: { variantType: string, variantItems: any[] }[] = [];
  variantGroups: { variantType: string; variantItems: any[]; options: string[] }[] = [];




  // ------------------------------------------------------------------------------------------------
  addVariantGroup(): void {
    this.variantGroups.push({ variantType: '', variantItems: [], options: [] });
  }
  
  
  removeVariantGroup(index: number): void {
    this.variantGroups.splice(index, 1);
  }
  
  onVariantTypeChange(variantTypeId: string, index: number): void {
    // Find the variant type's name using its ID
    const selectedVariantType = this.variantTypes.find(type => type.id === variantTypeId);
    
    // Update the variantGroup's variantType to store the name instead of the ID
    this.variantGroups[index].variantType = selectedVariantType ? selectedVariantType.nom : '';
  
    // Fetch the variants for this type
    this.variantTypeService.getVariants().subscribe((variants) => {
      this.variantGroups[index].variantItems = variants.filter(variant => variant.variantTypeId === variantTypeId);
    });
  }
  
  
  
  onVariantCheckboxChange(event: any, variantId: string, groupIndex: number): void {
    const variantItems = this.variantGroups[groupIndex].variantItems;
    const selectedVariant = variantItems.find(variant => variant.id === variantId);
  
    if (selectedVariant) {
      // Add or remove the variant based on whether the checkbox is checked
      if (event.checked) {
        if (!this.variantGroups[groupIndex].options) {
          this.variantGroups[groupIndex].options = [];
        }
        this.variantGroups[groupIndex].options.push(selectedVariant.nom); // Store the name of the selected variant
      } else {
        this.variantGroups[groupIndex].options = this.variantGroups[groupIndex].options.filter(option => option !== selectedVariant.nom);
      }
    }
  }
  
  
// ------------------------------------------------------------------------------------------------
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private variantTypeService: VariantTypeService,
    @Inject(MAT_DIALOG_DATA) public data: any  // Pour recevoir les données (produit à modifier)
  ) {}

  // ngOnInit(): void {
  //   this.productForm = this.fb.group({
  //     productName: ['', Validators.required],
  //     description: ['', Validators.required],
  //     price: [0, Validators.required],
  //     quantity: [0, Validators.required],
  //     category: ['', Validators.required], // La catégorie est maintenant requise
  //     subCategory: ['', Validators.required],
  //     variantType: ['', Validators.required],
  //     variantItem: [[], Validators.required]
  //   });
  
  //   // Charger les catégories et les variantes
  //   this.loadCategories();
  //   this.loadVariantTypes();
    
  //   // Si des données de produit sont passées, c'est le mode modification
  //   if (this.data && this.data.product) {
  //     this.isEditMode = true;
  //     this.setProductFormValues(this.data.product);
  //   }
  // }
  ngOnInit(): void {
    console.log('Initializing form...');
    
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      variantType: [''],
      variantItem: [[]]
    });
    
    // Charger les catégories et les variantes
    this.loadCategories();
    this.loadVariantTypes();
    
    if (this.data && this.data.product) {
      console.log('Edit mode activated. Product data:', this.data.product);
      this.isEditMode = true;
      this.setProductFormValues(this.data.product);
    }
  }
  
  

  // Charger les catégories
  loadCategories(): Promise<void> {
    return this.categoryService.getCategoriesWithImages().then((categories) => {
      this.categories = categories;
    });
  }
  

  // Charger les types de variantes
  loadVariantTypes(): Promise<void> {
    return new Promise((resolve) => {
      this.variantTypeService.getVariantTypes().subscribe((variantTypes) => {
        this.variantTypes = variantTypes;
        resolve();
      });
    });
  }
  

  // Charger les sous-catégories en fonction de la catégorie
  onCategoryChange(categorieId: string): Promise<void> {
    return this.subcategoryService.getAllSubcategories().then((subCategories) => {
      this.subCategories = subCategories.filter(subCategory => subCategory.categorieId === categorieId);
    });
  }
  
  

  // // Charger les variantes en fonction du type de variante sélectionné
  // onVariantTypeChange(variantTypeId: string): void {
  //   this.variantTypeService.getVariants().subscribe((variants) => {
  //     this.variantItems = variants.filter(variant => variant.variantTypeId === variantTypeId);
  //   });
  // }

  // Gestion de la sélection des images
  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[index] = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImages[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remplir le formulaire avec les valeurs du produit existant en mode modification
  // Remplir le formulaire avec les valeurs du produit existant en mode modification
// Remplir le formulaire avec les valeurs du produit existant en mode modification
setProductFormValues(product: any): void {
  console.log('Setting form values for product:', product);

  this.loadCategories().then(() => {
    console.log('Categories loaded:', this.categories);
    const selectedCategory = this.categories.find(category => category.id === product.categoryId);
    this.productForm.patchValue({
      category: selectedCategory ? selectedCategory.id : '',
    });

    this.onCategoryChange(product.categoryId).then(() => {
      console.log('Subcategories loaded:', this.subCategories);
      const selectedSubCategory = this.subCategories.find(subCategory => subCategory.id === product.subcategoryId);
      this.productForm.patchValue({
        subCategory: selectedSubCategory ? selectedSubCategory.id : '',
      });
    });
  });

  this.loadVariantTypes().then(() => {
    console.log('Variant types loaded:', this.variantTypes);
    this.variantGroups = [];

    if (product.variantData && product.variantData.length > 0) {
      product.variantData.forEach((variant: any) => {
        const variantGroup = {
          variantType: variant.type,
          variantItems: [] as any[],
          options: variant.options || []
        };

        const selectedVariantType = this.variantTypes.find(type => type.nom === variant.type);
        if (selectedVariantType) {
          this.variantTypeService.getVariants().subscribe((variants: any[]) => {
            variantGroup.variantItems = variants.filter(v => v.variantTypeId === selectedVariantType.id);
            console.log('Loaded variant items for type:', selectedVariantType.nom, variantGroup.variantItems);
          });
        }

        this.variantGroups.push(variantGroup);
      });
    }
    console.log('Final variant groups:', this.variantGroups);
  });

  this.productForm.patchValue({
    productName: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
  });

  this.selectedImages[0] = product.mainImageUrl || null;
  this.selectedImages[1] = product.secondImageUrl || null;
  this.selectedImages[2] = product.thirdImageUrl || null;
  this.selectedImages[3] = product.fourthImageUrl || null;

  console.log('Form values set:', this.productForm.value);
}



  
  // Gestion de la soumission du formulaire (Ajout ou Modification)
  // Gestion de la soumission du formulaire (Ajout ou Modification)
  async onSubmit(): Promise<void> {
  console.log('Submit button clicked');
  if (this.productForm.valid) {
    console.log('Form is valid, processing submission...');
    console.log('Variant Groups:', this.variantGroups); // Debugging log

    const productData = this.productForm.value;
    const categoryId = productData.category;
    const subCategoryId = productData.subCategory?.id || productData.subCategory;

    try {
      // Handle image uploads
      const uploadedImages = await Promise.all(
        this.selectedFiles.map(async (file, index) => {
          if (file) {
            return await this.productService.uploadImage(file, `products/image-${index + 1}`);
          } else if (this.isEditMode && this.data?.product) {
            return this.data.product[`mainImageUrl`];
          }
          return null;
        })
      );

      // Construct the variantData
      const variantData = this.variantGroups
        .filter(group => group.variantType) // Ensure that variantType is not empty
        .map(group => ({
          type: group.variantType, // Store the name of the variant type
          options: group.options || [] // Use the options stored in the variantGroups
        }));

      const updateData: any = {
        productName: productData.productName,
        price: productData.price,
        quantity: productData.quantity,
        description: productData.description,
        categoryId: categoryId,
        subcategoryId: subCategoryId,
        mainImageUrl: uploadedImages[0] || (this.isEditMode && this.data?.product?.mainImageUrl) || null,
        secondImageUrl: uploadedImages[1] || (this.isEditMode && this.data?.product?.secondImageUrl) || null,
        thirdImageUrl: uploadedImages[2] || (this.isEditMode && this.data?.product?.thirdImageUrl) || null,
        fourthImageUrl: uploadedImages[3] || (this.isEditMode && this.data?.product?.fourthImageUrl) || null,
        variantData: variantData || (this.isEditMode && this.data?.product?.variantData) || []
      };

      if (this.isEditMode && this.data?.product?.id) {
        await this.productService.updateProduct(this.data.product.id, updateData);
      } else {
        await this.productService.addProduct(
          productData.productName,
          productData.price,
          productData.quantity,
          productData.description,
          categoryId,
          subCategoryId,
          uploadedImages[0],
          uploadedImages[1] || null,
          uploadedImages[2] || null,
          uploadedImages[3] || null,
          variantData
        );
      }

      this.dialogRef.close();
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
    }
  } else {
    console.error('Form is invalid');
  }
}

  
  
  
  
  

  
  
  
  

  // Gestion de la sélection des variantes avec les cases à cocher
  // onVariantCheckboxChange(event: any, variantId: string): void {
  //   let variantItems = this.productForm.value.variantItem || [];

  //   if (event.checked) {
  //     variantItems.push(variantId);
  //   } else {
  //     variantItems = variantItems.filter((id: string) => id !== variantId);
  //   }

  //   this.productForm.patchValue({
  //     variantItem: variantItems
  //   });
  // }

  onClose(): void {
    this.dialogRef.close();
  }
}
