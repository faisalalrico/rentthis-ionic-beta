import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { Capacitor } from '@capacitor/core';
import { InAppBrowser, DefaultSystemBrowserOptions } from '@capacitor/inappbrowser';

@Component({
  selector: 'app-myitem',
  templateUrl: './myitem.page.html',
  styleUrls: ['./myitem.page.scss'],
  standalone: false,
})
export class MyitemPage implements OnInit {
  transactions: any[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions(event?: any) {
    this.transactionService.getMyTransactions().subscribe({
      next: (res) => {
        this.transactions = res;
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error('Gagal mengambil transaksi:', err);
        if (event) event.target.complete();
      }
    });
  }

  getStatusLabel(transaction: any): string {
    const startDate = new Date(transaction.start_from);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + transaction.days);

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (now < startDate) {
      return 'Telah Dipesan';
    } else {
      return 'Penyewaan Selesai';
    }
  }

  async openInAppBrowser(url: string) {
    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
      window.open(url, '_blank');
    } else {
      await InAppBrowser.openInSystemBrowser({
        url,
        options: DefaultSystemBrowserOptions
      });
    }
  }
}
