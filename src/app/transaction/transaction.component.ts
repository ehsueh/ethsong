import { Component, OnInit, Input } from '@angular/core';

function heatMapColorforValue(value) {
  var h = (1.0 - value) * 230
  return "hsl(" + h + ", 80%, 30%)";
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {

  @Input() ethValue: number;
  @Input() maxValue: number;
  @Input() txHash: string;
  color() {
    return heatMapColorforValue(this.ethValue / this.maxValue);
  }

  link() {
    var etherscan = "https://etherscan.io/tx/";
    return etherscan + this.txHash;
  }
  constructor() {
  }

  ngOnInit() {
  }



}
