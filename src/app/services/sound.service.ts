import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  audioCtx
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
  progression = [
    0,
    5,
    3,
    4
  ]
  counter = 0
  chord = 0

  constructor() { this.audioCtx = new AudioContext() }

  createAmplifier(audio, startValue, duration) {
    const amplifier = audio.createGain();
    this.rampDown(audio, amplifier.gain, startValue, duration);
    return amplifier;
  };

  rampDown(audio, value, startValue: number, duration: number) {
    value.setValueAtTime(startValue, audio.currentTime);
    value.exponentialRampToValueAtTime(0.01, audio.currentTime + duration);
  };

  chain(soundNodes) {
    for (let i = 0; i < soundNodes.length - 1; i++) {
      soundNodes[i].connect(soundNodes[i + 1]);
    }
  };

  sing(txValue, duration = 1) {
    const sine = this.audioCtx.createOscillator()
    let note
    if (txValue < 0.1) { note = 0 }
    else if (txValue < 0.5) { note = 1 }
    else if (txValue < 1) { note = 2 }
    else { note = 3 }

    note = note * 2 + this.progression[this.chord]
    if (note > 7) {
      note -= 8
    }

    sine.frequency.value = this.notes[note]
    sine.start()
    sine.stop(this.audioCtx.currentTime + duration);

    this.chain([
      sine,
      this.createAmplifier(this.audioCtx, 0.4, duration),
      this.audioCtx.destination
    ])

    this.counter++;
    if (this.counter == 4) {
      this.chord++;
      this.counter = 0
    }
    if (this.chord > 3) this.chord = 0;
  }
}



