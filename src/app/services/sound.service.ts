import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  audioCtx
  compressor
  notes = [
    261.63,
    293.66,
    329.63,
    349.23,
    392.00,
    440.00,
    493.88,
    523.25
  ]
  progression = [0, 5, 3, 4] // I vi IV V
  counter = 0
  chord = 0
  noteDuration = 1

  constructor() {
    this.audioCtx = new AudioContext()
    this.compressor = this.audioCtx.createDynamicsCompressor()
    this.compressor.threshold.setValueAtTime(-50, this.audioCtx.currentTime);
    this.compressor.knee.setValueAtTime(40, this.audioCtx.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.audioCtx.currentTime);
    this.compressor.attack.setValueAtTime(0, this.audioCtx.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.audioCtx.currentTime);
  }

  createAmplifier() {
    const amplifier = this.audioCtx.createGain()
    amplifier.gain.setValueAtTime(0, this.audioCtx.currentTime)
    amplifier.gain.linearRampToValueAtTime(1, this.audioCtx.currentTime + 0.1)
    amplifier.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + this.noteDuration)
    return amplifier;
  };

  chain(soundNodes) {
    for (let i = 0; i < soundNodes.length - 1; i++) {
      soundNodes[i].connect(soundNodes[i + 1]);
    }
  };

  sing(txValue) {
    const sine = this.audioCtx.createOscillator()
    let note
    if (txValue < 0.1) { note = 0 }         // root
    else if (txValue < 0.5) { note = 1 }    // third
    else if (txValue < 1) { note = 2 }      // fifth
    else { note = 3 }                       // seventh

    note = note * 2 + this.progression[this.chord]
    if (note > 7) {
      note -= 8
    }

    sine.frequency.value = this.notes[note]

    this.chain([
      sine,
      this.createAmplifier(),
      this.compressor,
      this.audioCtx.destination
    ])

    sine.start()
    sine.stop(this.audioCtx.currentTime + this.noteDuration);

    this.counter++;
    if (this.counter == 4) {
      this.chord++;
      this.counter = 0
    }
    if (this.chord > 3) this.chord = 0;
  }
}
