import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface CartItem {
  item_id: number;
  days: number;
  start_from: string;  // format: "YYYY-MM-DD"
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl + '/cart';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  addToCart(data: CartItem): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post(this.apiUrl, data, { headers });
      })
    );
  }

  getCartItems(): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get(this.apiUrl, { headers });
      })
    );
  }

  removeCartItem(itemId: number): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post(`${this.apiUrl}-delete/${itemId}`, [], { headers });
      })
    );
  }

  checkout(cartItemId: number, paymentType: 'manual' | 'online'): Observable<any> {
    const url = environment.apiUrl + '/transaction/checkout';

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        console.log('Token Coyyyy:', token);
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        return this.http.post(url, {
          cart_items_id: cartItemId,
          payment_type: paymentType,
        }, { headers });
      })
    );
  }
}
