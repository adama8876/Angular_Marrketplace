export interface Variant {
    id: string;
    nom: string;
    variantTypeId: string;
    createdAt: any; // Ou 'Date' si tu convertis Firestore Timestamps en objets Date
  }
  

  export interface User {
    id: string;
    email: string;
    password: string; // À ne pas stocker en clair
    prenom?: string;
    nom?: string;
    role?: string; // Peut être 'client' ou 'vendeur'
    telephone?: string;
    profileImage?: string;
    isActive: boolean; // Nouveau champ pour les vendeurs
    boutiqueNom?: string; // Nouveau champ pour le nom de la boutique
    description?: string;
  }


  export interface Commandes {
    id: string;
    adresse: string[]; 
    dateLivraison: string; 
    items: {
      price: number;
      productId: string;
      quantity: number;
      status: string; 
      variant: string | null; 
    }[]; 
    paymentDetails: {
      method: string;
      sousTotal: number;
    }[]; 
    totalAmount: number;
    userId: string;
    status: string;
    userEmail: string;
    userPhone: string; 
  }
  