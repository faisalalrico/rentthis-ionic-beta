import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabItemPage } from './tab-item.page';

const routes: Routes = [
  {
    path: '',
    component: TabItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabItemPageRoutingModule {}
