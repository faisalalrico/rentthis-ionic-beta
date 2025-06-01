import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async onRegister() {
    const loading = await this.loadingCtrl.create({ message: 'Mendaftarkan akun...' });
    await loading.present();

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Registrasi berhasil. Silakan login.',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigateByUrl('/login');
      },
      error: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Registrasi gagal. Coba lagi.',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
