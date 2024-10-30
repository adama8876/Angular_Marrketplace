import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { VarianteService } from '../Services/variante.service';
import { VariantTypeService } from '../Services/variant-type.service';
import { UserService } from '../Services/utilisateurs.service';
import { User } from '../Interface/variant';
import { MatIcon } from '@angular/material/icon';
// import { UserService } from '../Services/utilisateurs.service';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, MatPaginator, CommonModule, MatIcon],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements OnInit  {

   utilisateurs: User[] = [];  
   filteredUtilisateurs: User[] = []; 

  constructor(private utilisateursService: UserService) {}

  ngOnInit(): void {
    
    this.utilisateursService.getUsers().subscribe(users => {
      this.utilisateurs = users; 
      this.filteredUtilisateurs = users;
    });
  }


  
  toggleActive(userId: string, currentStatus: boolean) {
    this.utilisateursService.toggleUserActiveStatus(userId, currentStatus)
      .then(() => {
        console.log('Statut de l’utilisateur mis à jour avec succès');
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du statut de l’utilisateur:', error);
      });
  }


  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUtilisateurs = this.utilisateurs.filter(utilisateur => 
      utilisateur.email.toLowerCase().includes(searchTerm) 
    );
  }
}
