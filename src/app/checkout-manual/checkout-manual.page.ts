import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-checkout-manual',
  templateUrl: './checkout-manual.page.html',
  styleUrls: ['./checkout-manual.page.scss'],
  standalone: false,
})
export class CheckoutManualPage implements OnInit {
  transactionId: number = 0;
  transaction: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.transactionId = +this.route.snapshot.paramMap.get('id')!;
    await this.storage.create();
    this.getTransactionDetails();
  }

  async getTransactionDetails() {
    const token = await this.storage.get('token');
    if (!token) {
      this.error = 'Token tidak ditemukan. Silakan login ulang.';
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${environment.apiUrl}/transaction/${this.transactionId}`, { headers })
      .subscribe({
        next: (res) => {
          this.transaction = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Gagal ambil detail transaksi:', err);
          this.error = 'Gagal mengambil data transaksi.';
          this.isLoading = false;
        }
      });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  async onSubmit() {
    if (!this.selectedFile) return;

    const loading = await this.loadingCtrl.create({ message: 'Mengupload bukti...' });
    await loading.present();

    const token = await this.storage.get('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const formData = new FormData();
    formData.append('payment_proof', this.selectedFile);

    this.http.post(`${environment.apiUrl}/transaction/upload/${this.transactionId}`, formData, { headers })
      .subscribe({
        next: async () => {
          await loading.dismiss();
          this.uploadSuccess = true;
          const toast = await this.toastCtrl.create({
            message: 'Bukti pembayaran berhasil diupload!',
            color: 'success',
            duration: 2000
          });
          await toast.present();
          this.getTransactionDetails();
          this.selectedFile = null;
        },
        error: async () => {
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'Upload gagal. Coba lagi.',
            color: 'danger',
            duration: 2000
          });
          await toast.present();
        }
      });
  }
}
