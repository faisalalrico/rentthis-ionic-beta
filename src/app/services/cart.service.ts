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

  async removeCartItem(itemId: number) {
    const token = await this.authService.getToken();
    console.log('DELETE URL:', `${this.apiUrl}/${itemId}`);
    console.log('Bearer Token:', token);
    
    return this.http.delete(`${this.apiUrl}/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).toPromise();
  }
}
