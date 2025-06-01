import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ItemService, Item } from '../services/item.service';
import { Subscription } from 'rxjs';

interface CartItem {
  id: number;
  item_id: number;
  days?: number;
  start_from?: string;
  total_price?: number;
  // tambahkan properti lain sesuai kebutuhan
}

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  user: any = null;
  isLoggedIn = false;
  cartItems: (CartItem & { name?: string })[] = [];
  items: Item[] = [];

  private authSub?: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private itemService: ItemService,
  ) {}

  ngOnInit() {
    this.authSub = this.authService.authState.subscribe(isLogged => {
      this.isLoggedIn = isLogged;

      if (isLogged) {
        this.loadUserProfile();
        this.loadItems();  // load items dulu, baru load cart
      } else {
        this.user = null;
        this.cartItems = [];
        this.items = [];
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async loadUserProfile() {
    try {
      this.user = await this.authService.getProfile();
    } catch (err) {
      console.error('Gagal ambil profil:', err);
      this.user = null;
    }
  }

  loadItems() {
    this.itemService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loadCart();
      },
      error: (err) => {
        console.error('Gagal load items:', err);
      }
    });
  }

  loadCart() {
    this.cartService.getCartItems().subscribe({
      next: (cart: any[]) => {
        this.cartItems = cart.map(cartItem => ({
          ...cartItem,
          name: cartItem.item?.name || 'Nama item tidak ditemukan',
        }));
      },
      error: (err) => {
        console.error('Gagal load cart:', err);
      }
    });
  }

  async removeFromCart(item: any) {
    try {
      await this.cartService.removeCartItem(item.id);
      this.cartItems = this.cartItems.filter(ci => ci.id !== item.id);
    } catch (err) {
      console.error('Gagal menghapus item dari keranjang:', err);
    }
  }

  onCheckout(item: any) {
    console.log('Checkout item:', item);
  }
}
