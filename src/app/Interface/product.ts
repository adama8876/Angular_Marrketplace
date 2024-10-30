
export interface Product {

    id?: string;          
    nom: string;
    description: string;
    prix: number;
    quantité: number;
    dateDeCreation: Date;
    imageURL: string;
    categorie: string;
    sousCategorie?: string;
    createurId: string;    
    createurNom: string;   
    
  }
  


  