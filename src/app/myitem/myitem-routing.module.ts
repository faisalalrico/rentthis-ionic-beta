import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyitemPage } from './myitem.page';

const routes: Routes = [
  {
    path: '',
    component: MyitemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyitemPageRoutingModule {}
