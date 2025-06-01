import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = environment.apiUrl;
  private _storage: Storage | null = null;

  // BehaviorSubject untuk status login
  public authState = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.checkToken();
  }

  // Login dengan async/await, simpan token, update authState
  async login(credentials: { email: string; password: string }) {
    const res: any = await this.http.post(`${this.API_URL}/login`, credentials).toPromise();
    await this.setToken(res.token);
    this.authState.next(true);
    return res;
  }

  // Register tetap Observable (atau bisa juga diubah async kalau mau)
  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  async setToken(token: string) {
    await this._storage?.set('token', token);
  }

  async getToken() {
    return this._storage?.get('token');
  }

  // Ambil profil dengan header Authorization dari token di Storage
  async getProfile() {
    const token = await this.getToken();
    return this.http.get(`${this.API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).toPromise();
  }

  // Logout hapus token dan update authState
  async logout() {
    await this._storage?.remove('token');
    this.authState.next(false);
  }

  async checkToken() {
    const token = await this.getToken();
    this.authState.next(!!token);
  }
}
