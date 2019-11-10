import { Component, Input } from '@angular/core';

function heatMapColorforValue(value) {
  const h = (1.0 - value) * 230;
  return `hsl(${h}, 80%, 30%)`;
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {

  @Input() ethValue: number;
  @Input() maxValue: number;
  @Input() hash: string;

  constructor() {
  }

  color() {
    return heatMapColorforValue(this.ethValue / this.maxValue);
  }

  open() {
    window.open(`https://etherscan.io/tx/${this.hash}`, '_blank');
  }

}
