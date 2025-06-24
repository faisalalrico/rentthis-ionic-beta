import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async onLogin() {
    const loading = await this.loadingCtrl.create({ message: 'Logging in...' });
    await loading.present();

    try {
      const res = await this.authService.login({ email: this.email, password: this.password });
      await loading.dismiss();
      this.router.navigateByUrl('/tabs/tab1');
    } catch (err) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: JSON.stringify(err) || 'Login gagal. Periksa email/password.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
