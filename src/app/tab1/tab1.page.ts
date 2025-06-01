import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemService, Item } from '../services/item.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  items: Item[] = [];
  isLoading = false;

  isLoggedIn = false;
  userData: any = null;

  private authSub?: Subscription;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSub = this.authService.authState.subscribe(isLogged => {
      this.isLoggedIn = isLogged;

      if (isLogged) {
        this.loadUserProfile();
      } else {
        this.userData = null;
      }
    });

    this.loadItems();
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async loadUserProfile() {
    try {
      this.userData = await this.authService.getProfile();
    } catch (error) {
      this.isLoggedIn = false;
      this.userData = null;
    }
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/default.png'; // fallback image

    // Cek apakah path sudah absolut
    if (path.startsWith('http')) return path;

    // Hapus '/api' dari apiUrl agar dapat base URL
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${path}`;
  }

  loadItems(event?: any) {
    this.isLoading = true;
    this.itemService.getItems().subscribe({
      next: (data) => {
        this.items = data;
         // Ambil brand unik dari semua item
        this.brands = [...new Set(data.map(item => item.brand).filter(b => !!b))];
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      },
      error: (err) => {
        console.error('Gagal load items', err);
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToItem(itemId: number) {
    this.router.navigate(['/tab-item', itemId]);
  }

  // Filter state
  searchTerm = '';
  showFilter = false;

  minPrice?: number;
  maxPrice?: number;
  selectedBrand = '';
  selectedTransmisi = '';
  selectedType = '';

  // Temp filter untuk Apply
  tempMinPrice?: number;
  tempMaxPrice?: number;
  tempBrand = '';
  tempTransmisi = '';
  tempType = '';

  brands: string[] = [];

  get filteredItems(): Item[] {
    return this.items
      .filter(item => {
        const matchesSearch = !this.searchTerm || (
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

        const matchesBrand = !this.selectedBrand || item.brand === this.selectedBrand;
        const matchesTransmisi = !this.selectedTransmisi || item.transmisi === this.selectedTransmisi;
        const matchesType = !this.selectedType || item.type === this.selectedType;

        const matchesMinPrice = this.minPrice == null || item.price >= this.minPrice;
        const matchesMaxPrice = this.maxPrice == null || item.price <= this.maxPrice;

        return matchesSearch && matchesBrand && matchesTransmisi && matchesType && matchesMinPrice && matchesMaxPrice;
      });
  }

  applyFilters() {
    this.minPrice = this.tempMinPrice;
    this.maxPrice = this.tempMaxPrice;
    this.selectedBrand = this.tempBrand;
    this.selectedTransmisi = this.tempTransmisi;
    this.selectedType = this.tempType;
  }

  clearFilters() {
    this.tempMinPrice = undefined;
    this.tempMaxPrice = undefined;
    this.tempBrand = '';
    this.tempTransmisi = '';
    this.tempType = '';

    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.selectedBrand = '';
    this.selectedTransmisi = '';
    this.selectedType = '';
  }
}