import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../transaction/transaction';

export interface TransactionKeyValue {
  key: string;
  value: Transaction;
}
@Pipe({
  name: 'transactionFilter'
})
export class TransactionFilterPipe implements PipeTransform {

  transform(transactionKeyValues: TransactionKeyValue[], ...[zeroEth]: [boolean]): any {
    return transactionKeyValues.filter(transactionKeyValue => {
      if (!zeroEth) {
        return transactionKeyValue.value.value > 0;
      }
      return transactionKeyValue;
    });
  }

}
