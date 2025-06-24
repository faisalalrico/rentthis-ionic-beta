import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutManualPage } from './checkout-manual.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutManualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutManualPageRoutingModule {}
