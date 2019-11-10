import { Component, OnDestroy } from '@angular/core';
import { DfuseService } from '../services/dfuse.service';
import { Transaction } from '../transaction/transaction';
import { filter } from 'rxjs/operators';
import { Filter } from '../filter/filter';
import { SoundService } from '../services/sound.service';
import { Subscription } from 'rxjs';

// TODO Can use GraphQL in dfuse to efficiently query instead of post-filtering here
// We're only doing this here now as PendingTransactions is in alpha mode and doesn't supoort some features yet
export function filterMatch(targetFilter: Filter, tx: Transaction) {
  return (targetFilter.from === '' || targetFilter.from.toLowerCase() === tx.from.toLowerCase())
    && (targetFilter.to === '' || targetFilter.to.toLowerCase() === tx.to.toLowerCase());
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  muteSwitch = 'Mute';

  transactions: Map<string, Transaction> = new Map();
  maxValue = 1;

  cormirmedTransactionsSubscription: Subscription;
  pendingTransactionsSubscription: Subscription;

  constructor(
    private dfuse: DfuseService,
    sound: SoundService,
  ) {
    this.cormirmedTransactionsSubscription = this.dfuse.confirmations().subscribe(tx => this.transactions.delete(tx.hash));
    this.pendingTransactionsSubscription = this.dfuse.memoryPool()
      .pipe(
        filter(tx => tx.value > 0),
        filter(tx => this.qualify(tx, dfuse.filters))
      )
      .subscribe(tx => {
        this.transactions.set(tx.hash, tx);
        if (this.muteSwitch === 'Mute') {
          sound.sing(tx.value);
        }
        if (tx.value > this.maxValue) {
          this.maxValue = tx.value;
        }
      });
  }

  ngOnDestroy() {
    this.pendingTransactionsSubscription.unsubscribe();
    this.cormirmedTransactionsSubscription.unsubscribe();
  }

  qualify(tx: Transaction, filters: Filter[] = []): boolean {
    if (filters.length === 0) {
      return true;
    }
    for (const txFilter of filters) {
      return filterMatch(txFilter, tx) ? true : false;
    }
    return false;
  }


  toggleMute() {
    this.muteSwitch = (this.muteSwitch === 'Mute') ? 'Unmute' : 'Mute';
  }

}
