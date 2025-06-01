import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService, Item } from '../services/item.service';
import { CartService, CartItem } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.page.html',
  styleUrls: ['./tab-item.page.scss'],
  standalone: false,
})
export class TabItemPage implements OnInit {
  itemId!: number;
  item?: Item;

  // Contoh input untuk sewa:
  days: number = 1;
  startFrom: string = '';

  isLoading: boolean = false;
  message: string = '';
  messageColor: 'success' | 'danger' | 'warning' | 'primary' = 'primary';

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  userData: any = null;
  isLoggedIn: boolean = false;

  ngOnInit() {
    const today = new Date();
    today.setDate(today.getDate() + 3); // +3 hari
    this.startFrom = today.toISOString().slice(0, 10);
    const minDateStr = today.toISOString().slice(0, 10);
    
    if (this.startFrom < minDateStr) {
      this.showToast('Tanggal mulai sewa harus minimal 3 hari dari hari ini.', 'danger');
      return;
    }

    this.itemId = +this.route.snapshot.paramMap.get('id')!;
    this.loadItem();

    // Cek login dan load profile
    this.authService.authState.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
      if (isLogged) {
        this.loadUserProfile();
      } else {
        this.userData = null;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async loadUserProfile() {
    try {
      const res = await this.authService.getProfile();
      this.userData = res;
    } catch {
      this.isLoggedIn = false;
      this.userData = null;
    }
  }

  loadItem() {
    this.isLoading = true;
    this.itemService.getItemById(this.itemId).subscribe({
      next: (data) => {
        this.item = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Gagal load item detail:', err);
        this.isLoading = false;
      },
    });
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/default.png'; // fallback image

    // Cek apakah path sudah absolut
    if (path.startsWith('http')) return path;

    // Hapus '/api' dari apiUrl agar dapat base URL
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${path}`;
  }

  tambahKeCart() {
    if (!this.item) {
      this.showToast('Item tidak ditemukan.', 'danger');
      return;
    }

    const payload: CartItem = {
      item_id: this.item.id,
      days: this.days,
      start_from: this.startFrom,
    };

    this.cartService.addToCart(payload).subscribe({
      next: (res: any) => {
        this.showToast('Berhasil menambahkan ke keranjang!', 'success');
      },
      error: (err: any) => {
        console.error('Error add to cart:', err);

        if (err.status === 403) {
          this.showToast(err.error.message || 'Akses ditolak. Periksa dokumen.', 'warning');
        } else if (err.status === 400) {
          this.showToast(err.error.message || 'Item tidak tersedia.', 'danger');
        } else if (err.status === 409) {
          this.showToast(err.error.message || 'Item sedang dipesan orang lain.', 'warning');
        } else {
          this.showToast('Gagal menambahkan ke keranjang.', 'danger');
        }
      }
    });
  }
}
