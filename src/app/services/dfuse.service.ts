import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../transaction/transaction';
const { createDfuseClient } = require("@dfuse/client")

@Injectable({
  providedIn: 'root'
})
export class DfuseService {

  client: any;

  constructor() {
    this.client = createDfuseClient({
      apiKey: 'web_4a7da19d57288bf91f508f108e25f5f9',
      network: "mainnet.eth.dfuse.io",
    })
  }

  operation = `subscription($cursor: String!) {
    searchTransactions(indexName:CALLS, query:"", lowBlockNum: -1, cursor: $cursor) {
      undo cursor
      node { hash matchingCalls { from to value(encoding:ETHER) } }
    }
  }`;

  start() {
    return new Observable<Transaction>(subscriber => {
      const stream = this.client.graphql(this.operation, (message) => {
        if (message.type === 'data') {
          const { undo, cursor, node: { hash, value, matchingCalls } } = message.data.searchTransactions;
          matchingCalls.forEach((tx) => {
            // console.log(from, to, value)
            subscriber.next({hash, ...tx});
          })

          // Mark stream at cursor location, on re-connect, we will start back at cursor
          // stream.mark({ cursor });
        }

        if (message.type === "error") {
          console.log("An error occurred", message.errors, message.terminal)
        }

        if (message.type === "complete") {
          console.log("Completed")
        }
      })
    })

    // Waits until the stream completes, or forever
    // await stream.join()
    // await client.release()
  }

}
