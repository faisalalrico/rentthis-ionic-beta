import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getMyTransactions(): Observable<any> {
    const url = environment.apiUrl + '/transaction/mine'; // <-- pakai /mine

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        console.log('TOKEN DARI getToken:', token); // Debug
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get(url, { headers });
      })
    );
  }

  getTransaction(id: number): Observable<any> {
    const url = environment.apiUrl + '/transaction/' + id;

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get(url, { headers });
      })
    );
  }
}

