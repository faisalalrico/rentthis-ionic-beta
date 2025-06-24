import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutManualPageRoutingModule } from './checkout-manual-routing.module';

import { CheckoutManualPage } from './checkout-manual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutManualPageRoutingModule
  ],
  declarations: [CheckoutManualPage]
})
export class CheckoutManualPageModule {}
