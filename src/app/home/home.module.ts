import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomePage } from './home.page';
import { TransactionComponent } from '../transaction/transaction.component';
import { TransactionFilterPipe } from './transaction-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    TransactionComponent,
    TransactionFilterPipe,
    HomePage,
  ]
})
export class HomePageModule {}
