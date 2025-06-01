import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
  standalone: false
})
export class UpdateProfilePage {
  files: { [key: string]: File | null } = {
    ktp: null,
    sim_a: null,
    sim_c: null,
  };

  userData: any;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  /**
   * Dipanggil setiap kali halaman dibuka
   */
  async ionViewWillEnter() {
    const token = await this.authService.getToken();
    if (token) {
      try {
        const res = await this.authService.getProfile(); // pakai await, bukan subscribe
        this.userData = res;
        console.log('Data user terbaru:', this.userData); // Debug
      } catch (error) {
        console.error('Gagal ambil profil:', error);
      }
    }
  }

  /**
   * Menyimpan file yang dipilih ke state
   */
  onFileChange(event: any, type: string) {
    if (event.target.files.length > 0) {
      this.files[type] = event.target.files[0];
    }
  }

  /**
   * Menentukan warna berdasarkan status
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'verified': return 'success';
      case 'rejected': return 'danger';
      case 'invalid': return 'warning';
      case 'used': return 'medium';
      case 'failed': return 'danger';
      default: return 'dark';
    }
  }

  /**
   * Kirim data ke backend jika belum verified/used
   */
  async onSubmit() {
    const loading = await this.loadingCtrl.create({ message: 'Uploading...' });
    await loading.present();

    const formData = new FormData();

    // Upload hanya jika status belum 'verified' atau 'used'
    if (this.files['ktp'] && !['verified', 'used'].includes(this.userData?.ktp_status)) {
      formData.append('ktp', this.files['ktp']);
    }

    if (this.files['sim_a'] && !['verified', 'used'].includes(this.userData?.sim_a_status)) {
      formData.append('sim_a', this.files['sim_a']);
    }

    if (this.files['sim_c'] && !['verified', 'used'].includes(this.userData?.sim_c_status)) {
      formData.append('sim_c', this.files['sim_c']);
    }

    const token = await this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post(`${this.authService['API_URL']}/update-profile`, formData, { headers })
      .subscribe({
        next: async () => {
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'Upload berhasil',
            color: 'success',
            duration: 2000
          });
          await toast.present();
          this.ionViewWillEnter(); // refresh data setelah upload
        },
        error: async () => {
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'Upload gagal, coba lagi',
            color: 'danger',
            duration: 2000
          });
          await toast.present();
        }
      });
  }
}
