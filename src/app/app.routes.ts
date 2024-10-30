import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProduitsComponent } from './produits/produits.component';
import { CommandesComponent } from './commandes/commandes.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { CategorieComponent } from './categorie/categorie.component';
import { AvisComponent } from './avis/avis.component';
import { ApprobationComponent } from './approbation/approbation.component';
import { LoginComponent } from './login/login.component';
import { VarianteTypeComponent } from './variante-type/variante-type.component';
import { VarianteComponent } from './variante/variante.component';
import { SousCategoryComponent } from './sous-category/sous-category.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'produits', component: ProduitsComponent },
    { path: 'commandes', component: CommandesComponent },
    { path: 'utilisateurs', component: UtilisateursComponent },
    { path: 'categories', component: CategorieComponent },
    { path: 'avis', component: AvisComponent },
    { path: 'approbation', component: ApprobationComponent },
    { path: 'variantes', component: VarianteComponent },
    { path: 'variantes-types', component: VarianteTypeComponent },
    { path: 'sous-categorie', component: SousCategoryComponent },
    { path: 'login', component: LoginComponent },
    
    // Redirection par défaut vers login si aucun chemin n'est fourni
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Route wildcard pour capturer toutes les routes non définies
    { path: '**', redirectTo: 'login' }
];




