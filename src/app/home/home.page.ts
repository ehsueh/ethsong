import { Component } from '@angular/core';
import { DfuseService } from '../services/dfuse.service';
import { Transaction } from '../transaction/transaction';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  transactions: Map<string, Transaction> = new Map();
  maxValue = 1;

  constructor(
    dfuse: DfuseService,
  ) {
    dfuse.start().subscribe(tx => {
      if (tx.value > 0) {
        this.transactions.set(tx.hash, tx)
        console.log(tx)
        if (tx.value > this.maxValue) {
          this.maxValue = tx.value;
        }
        setTimeout(() => this.transactions.delete(tx.hash), 10000 + Math.random() * 10000)
        // console.log(this.transactions.values())
      }
    });
    // this.transactions.subscribe(console.log)
  }

}
