import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../Services/prouct.service';
import { CategoryService } from '../Services/category.service';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../Services/utilisateurs.service';
import { OrderService } from '../Services/commande_service.ts/commande.service';
import { AuthService } from '../Services/auth.service'; // Pour récupérer le rôle de l'utilisateur
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  categoryCount: number = 0;
  userCount: number = 0; 
  productCount: number = 0;
  userRole: string | null = null;
  doughnutChart: Chart | null = null;
  orders: any[] = []; // Stocke les commandes récupérées pour le graphique

  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService, 
    private userService: UserService, 
    private orderService: OrderService,
    private authService: AuthService // Injection de AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadProductCount(); 
    this.loadCategoryCount();
    this.createLineChart();
    this.loadUserCount();

    // Récupérer le rôle de l'utilisateur
    this.userRole = await this.authService.fetchUserRole();
    this.loadOrderStatusData();
  }

  loadProductCount(): void {
    this.productService.getProductsCount().subscribe(count => {
      this.productCount = count; 
    });
  }

  loadUserCount(): void {
    this.userService.getUtilisateursCount().subscribe(count => {
      this.userCount = count;
    });
  }

  loadCategoryCount(): void {
    this.categoryService.getCategoriesCount().subscribe(count => {
      this.categoryCount = count; 
    });
  }

  createLineChart() {
    new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          label: 'Ventes',
          data: [65, 59, 80, 81, 56, 55, 40, 56, 55, 38],
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#ffffff',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        },
        scales: {
          x: { display: true },
          y: { display: true }
        }
      }
    });
  }

  loadOrderStatusData() {
    const currentUser = this.authService.getCurrentUser();
    const vendorId = currentUser?.uid ?? '';

    if (this.userRole === 'vendeur') {
      this.loadOrdersForVendor(vendorId);
    } else {
      this.loadAllOrders();
    }
  }

  loadAllOrders(): void {
    this.orderService.getOrders().subscribe(async (orders) => {
      this.orders = await Promise.all(
        orders.map(async (order) => {
          const user = await this.authService.fetchUserData(order.userId);
          return {
            ...order,
            userEmail: user ? user.email : 'Email non disponible',
            userPhone: user ? user.telephone : 'Contact non disponible'
          };
        })
      );
      this.updateDoughnutData(this.orders); // Mise à jour des données du graphique
    });
  }

  loadOrdersForVendor(vendorId: string): void {
    this.orderService.getOrders().subscribe(async (orders) => {
      const vendorOrders = [];

      for (const order of orders) {
        for (const item of order.items) {
          const isAddedByVendor = await this.orderService.isProductAddedByVendor(item.productId, vendorId);
          
          if (isAddedByVendor) {
            vendorOrders.push(order);
            break;
          }
        }
      }
      this.updateDoughnutData(vendorOrders); // Mise à jour des données du graphique
    });
  }

  updateDoughnutData(orders: any[]): void {
    let enAttente = 0;
    let enTraitement = 0;
    let termine = 0;

    orders.forEach(order => {
      if (order.status === 'En attente') enAttente++;
      else if (order.status === 'en traitement') enTraitement++;
      else if (order.status === 'terminé') termine++;
    });

    this.createDoughnutChart([enAttente, enTraitement, termine]);
  }

  createDoughnutChart(data: number[]) {
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }

     new Chart('doughnutChart', {
      type: 'doughnut',
      data: {
        labels: ['En attente', 'En traitement', 'Terminé'],
        datasets: [{
          label: 'Commandes',
          data: data,
          backgroundColor: ['#42A5F5', '#FFCA28', '#FF8F6B'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'right' },
          tooltip: { enabled: true }
        }
      }
    });
  }
}
