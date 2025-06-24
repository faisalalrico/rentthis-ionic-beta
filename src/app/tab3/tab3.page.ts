import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  notifications: any[] = [];
  isLoggedIn = false;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.authState.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      if (loggedIn) {
        this.loadNotifications();
      } else {
        this.notifications = [];
      }
    });
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res.data;
        console.log('Notifikasi:', this.notifications);
      },
      error: (err) => {
        console.error('Gagal ambil notifikasi:', err);
      }
    });
  }

  ionViewDidEnter() {
    if (this.isLoggedIn) {
      this.loadNotifications(); // akan trigger backend update status
    }
  }
}
