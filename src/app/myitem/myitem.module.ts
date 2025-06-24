import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyitemPageRoutingModule } from './myitem-routing.module';

import { MyitemPage } from './myitem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyitemPageRoutingModule
  ],
  declarations: [MyitemPage]
})
export class MyitemPageModule {}
