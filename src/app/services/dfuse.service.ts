import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../transaction/transaction';
import { createDfuseClient } from '@dfuse/client';
import { Filter } from '../filter/filter';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DfuseService {

  constructor(
    private storage: Storage,
  ) {
    this.client = createDfuseClient({
      apiKey: 'web_4a7da19d57288bf91f508f108e25f5f9',
      network: 'mainnet.eth.dfuse.io',
    });
    storage.get('filters').then(filters => {
      if (filters) {
        this.filters = filters;
      }
    })
  }

  client: any;
  filters: Filter[] = [];

  memoryPoolOperation = `subscription { 
    _alphaPendingTransactions { hash to from value(encoding: ETHER) gasPrice(encoding: ETHER) gasLimit }
  }`;

  confirmOperation = `subscription($cursor: String!) {
    searchTransactions(indexName:CALLS, query:"", lowBlockNum: -1, cursor: $cursor) {
      undo cursor
      node { hash matchingCalls { from to value(encoding:ETHER) } }
    }
  }`;

  removeFilter(index: number) {
    this.filters.splice(index, 1);
    this.storage.set('filters', this.filters);
  }

  addFilter(filter: Filter) {
    this.filters.push(filter);
    this.storage.set('filters', this.filters);
  }

  memoryPool() {
    return new Observable<Transaction>(subscriber => {
      const stream = this.client.graphql(this.memoryPoolOperation, async (message) => {
        if (message.type === 'data') {
          subscriber.next(message.data._alphaPendingTransactions);
        }

        if (message.type === 'error') {
          console.log('An error occurred', message.errors, message.terminal);
        }

        if (message.type === 'complete') {
          console.log('Completed');
        }
      });
    });

    // Waits until the stream completes, or forever
    // await stream.join()
    // await client.release()
  }

  confirmations() {
    return new Observable<Transaction>(subscriber => {
      const stream = this.client.graphql(this.confirmOperation, async (message) => {
        if (message.type === 'data') {
          const { undo, cursor, node: { hash, value, matchingCalls } } = message.data.searchTransactions;
          matchingCalls.forEach((tx) => {
            subscriber.next({ hash, ...tx });
          });

          // Mark stream at cursor location, on re-connect, we will start back at cursor
          (await stream).mark({ cursor });
        }

        if (message.type === 'error') {
          console.log('An error occurred', message.errors, message.terminal);
        }

        if (message.type === 'complete') {
          console.log('Completed');
        }
      });
    });

    // Waits until the stream completes, or forever
    // await stream.join()
    // await client.release()
  }

}
