import { Component, OnDestroy } from '@angular/core';
import { DfuseService } from '../services/dfuse.service';
import { Transaction } from '../transaction/transaction';
import { map, filter } from 'rxjs/operators';
import { Filter } from '../filter/filter';
import { SoundService } from '../services/sound.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  muteSwitch = 'Mute';

  transactions: Map<string, Transaction> = new Map();
  maxValue = 1;

  _cormirmedTransactions = this.dfuse.confirmations();
  _cormirmedTransactionsSubscription: Subscription;
  _pendingTransactions = this.dfuse.memoryPool();
  _pendingTransactionsSubscription: Subscription;

  constructor(
    private dfuse: DfuseService,
    sound: SoundService,
  ) {
    this._cormirmedTransactionsSubscription = this._cormirmedTransactions.subscribe(tx => this.transactions.delete(tx.hash));
    this._pendingTransactionsSubscription = this._pendingTransactions
      .pipe(
        filter(tx => tx.value > 0),
        filter(tx => this.qualify(tx, dfuse.filters))
      )
      .subscribe(tx => {
        this.transactions.set(tx.hash, tx);
        if (this.muteSwitch === 'Mute') {
          sound.sing(tx.value)
        }
        if (tx.value > this.maxValue) {
          this.maxValue = tx.value;
        }
      });
  }

  ngOnDestroy() {
    this._pendingTransactionsSubscription.unsubscribe();
    this._cormirmedTransactionsSubscription.unsubscribe();
  }
  
  // TODO Use GraphQL in dfuse to efficiently query instead of post-filtering here
  // We're only doing this here now as PendingTransactions is in alpha mode and doesn't supoort some features yet
  qualify(tx: Transaction, filters: Filter[]): boolean {
    if (filters === undefined || filters.length == 0) return true
    for (let filter of filters) {
      console.log(filter.from)
      if ((filter.from === "" || filter.from.toLowerCase() === tx.from.toLowerCase()) && (filter.to === "" || filter.to.toLowerCase() === tx.to.toLowerCase())) {
        console.warn(filter.from, filter.to, tx.from)
        return true
      }
    }
    return false
  }

  toggleMute() {
    this.muteSwitch = (this.muteSwitch === 'Mute') ? 'Unmute' : 'Mute';
  }

}
