import { Component } from '@angular/core';
import { DfuseService } from '../services/dfuse.service';
import { Transaction } from '../transaction/transaction';
import { map, filter } from 'rxjs/operators';
import { Filter } from '../filter/filter';

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
    dfuse.confirmations().subscribe(tx => this.transactions.delete(tx.hash));
    dfuse.memoryPool()
      .pipe(filter(tx=>tx.value>0),filter(tx=>this.qualify(tx,dfuse.filters)))
      .subscribe(tx => {
        this.transactions.set(tx.hash, tx);
        console.log(tx)
        if (tx.value > this.maxValue) {
          this.maxValue = tx.value;
        }
    });
  }

  qualify(tx:Transaction, filters: Filter[]):boolean {
    if (filters === undefined || filters.length == 0) return true
    var flag = false
    for (let filter of filters) {
      console.log(filter.from, filter.to, tx.from)
      if (filter.from === "" || filter.from === tx.from) //&& (filter.to === "" || filter.to.toLowerCase() === tx.to.toLowerCase()))
      flag = true
    }
    return flag
  }
}
