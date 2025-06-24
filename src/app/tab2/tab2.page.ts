import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ItemService, Item } from '../services/item.service';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { InAppBrowser, DefaultSystemBrowserOptions } from '@capacitor/inappbrowser';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';

interface CartItem {
  id: number;
  item_id: number;
  days?: number;
  start_from?: string;
  total_price?: number;
  name?: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  items: Item[] = [];
  isLoggedIn = false;
  cartItems: CartItem[] = [];
  user: any = null;
  private authSub?: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private itemService: ItemService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSub = this.authService.authState.subscribe(isLogged => {
      this.isLoggedIn = isLogged;

      if (isLogged) {
        this.loadUserProfile();
        this.loadItems();
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

  loadItems(event?: any) {
    this.itemService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loadCart(event); // lempar event ke loadCart
      },
      error: (err) => {
        console.error('Gagal load items:', err);
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  loadCart(event?: any) {
    this.cartService.getCartItems().subscribe({
      next: (cart: any[]) => {
        this.cartItems = cart.map(cartItem => ({
          ...cartItem,
          name: cartItem.item?.name || 'Nama item tidak ditemukan',
        }));
        if (event) {
          event.target.complete(); // ✅ refresher selesai di sini
        }
      },
      error: (err) => {
        console.error('Gagal load cart:', err);
        if (event) {
          event.target.complete(); // ✅ tetap diselesaikan
        }
      }
    });
  }

  async removeFromCart(item: any) {
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err: any) => {
        console.error('Error hapus cart:', err);
      }
    });
  }

  async onCheckout(item: any) {
    const alert = await this.alertController.create({
      header: 'Pilih Metode Pembayaran',
      buttons: [
        {
          text: 'Manual Transfer',
          handler: () => {
            this.processCheckout(item.id, 'manual');
          }
        },
        {
          text: 'Bayar Online (QRIS)',
          handler: () => {
            this.processCheckout(item.id, 'online');
          }
        },
        {
          text: 'Batal',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  processCheckout(cartItemId: number, paymentType: 'manual' | 'online') {
    this.cartService.checkout(cartItemId, paymentType).subscribe({
      next: (res: any) => {
        console.log('Checkout sukses:', res);

        if (paymentType === 'online' && res.payment_url) {
          this.openInAppBrowser(res.payment_url);
        } else if (paymentType === 'manual') {
          this.goToManualCheckout(res.id); // ← pastikan backend return "id" transaksi
        }

        this.loadCart();
      },
      error: (err: any) => {
        console.error('Gagal checkout:', err);
        alert('Gagal melakukan checkout.');
      }
    });
  }

  async openInAppBrowser(url: string) {
    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
      // fallback web
      window.open(url, '_blank');
    } else {
      // native mobile (Android/iOS)
      await InAppBrowser.openInSystemBrowser({
        url,
        options: DefaultSystemBrowserOptions
      });
    }
  }

  goToManualCheckout(transactionId: number) {
    // Misal kamu pakai route bernama checkout_manual/:id
    // window.location.href = `/checkout_manual/${transactionId}`;
    // ATAU kalau pakai router Angular (lebih baik):
    this.router.navigate(['/checkout-manual', transactionId]);
  }
}
