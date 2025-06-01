import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabItemPageRoutingModule } from './tab-item-routing.module';
import { TabItemPage } from './tab-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabItemPageRoutingModule
  ],
  declarations: [TabItemPage]
})
export class TabItemPageModule {}
