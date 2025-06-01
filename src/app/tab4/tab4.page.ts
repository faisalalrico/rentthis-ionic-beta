import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page implements OnInit, OnDestroy {
  isLoggedIn = false;
  userData: any = null;
  authSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSub = this.authService.authState.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
      if (isLogged) {
        this.loadUserProfile();
      } else {
        this.userData = null;
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async loadUserProfile() {
    try {
      const res = await this.authService.getProfile();
      this.userData = res;
    } catch {
      this.isLoggedIn = false;
      this.userData = null;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
