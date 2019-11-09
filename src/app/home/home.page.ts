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
    dfuse.confirmations().subscribe(tx => this.transactions.delete(tx.hash));
    dfuse.memoryPool().subscribe(tx => {
      if (tx.value > 0) {
        this.transactions.set(tx.hash, tx);
        console.log(tx)
        sing(Math.round(tx.value))
        if (tx.value > this.maxValue) {
          this.maxValue = tx.value;
        }
      }
    });
  }
}

const notes = [
  261.63,
  293.66,
  329.63,
  349.23,
  392.00,
  440.00,
  493.88
]

function createAmplifier(audio, startValue, duration) {
  var amplifier = audio.createGain();
  rampDown(audio, amplifier.gain, startValue, duration);
  return amplifier;
};

function rampDown(audio, value, startValue, duration) {
  value.setValueAtTime(startValue, audio.currentTime);
  value.exponentialRampToValueAtTime(0.01, audio.currentTime + duration);
};

async function sing(note, duration = 1) {
  var audioCtx = new AudioContext;
  var sine = audioCtx.createOscillator();
  sine.frequency.value = notes[note]
  sine.start()
  sine.stop(audioCtx.currentTime + duration);

  chain([

    // `sineWave` outputs a pure tone.
    sine,

    // An amplifier reduces the volume of the tone from 60% to 0
    // over the duration of the tone.  This produces an echoey
    // effect.
    createAmplifier(audioCtx, 0.6, duration),

    // The amplified output is sent to the browser to be played
    // aloud.
    audioCtx.destination]);
}
function chain(soundNodes) {
  for (var i = 0; i < soundNodes.length - 1; i++) {
    soundNodes[i].connect(soundNodes[i + 1]);
  }
};
