import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  notes = [
    261.63,
    293.66,
    329.63,
    349.23,
    392.00,
    440.00,
    493.88
  ]

  createAmplifier(audio, startValue, duration) {
    const amplifier = audio.createGain();
    this.rampDown(audio, amplifier.gain, startValue, duration);
    return amplifier;
  };

  rampDown(audio, value, startValue: number, duration: number) {
    value.setValueAtTime(startValue, audio.currentTime);
    value.exponentialRampToValueAtTime(0.01, audio.currentTime + duration);
  };

  async sing(note, duration = 1) {
    const audioCtx = new AudioContext();
    const sine = audioCtx.createOscillator();

    if (note < 1) {
      sine.frequency.value = this.notes[0];
    }
    else if (note < 2) {
      sine.frequency.value = this.notes[1];
    }
    else if (note < 5) {
      sine.frequency.value = this.notes[2];
    }
    else if (note < 10) {
      sine.frequency.value = this.notes[3];
    }
    else if (note < 25) {
      sine.frequency.value = this.notes[4];
    }
    else if (note < 50) {
      sine.frequency.value = this.notes[5];
    }
    else {
      sine.frequency.value = this.notes[6];
    }

    sine.start()
    sine.stop(audioCtx.currentTime + duration);

    this.chain([

      // `sineWave` outputs a pure tone.
      sine,

      // An amplifier reduces the volume of the tone from 60% to 0
      // over the duration of the tone.  This produces an echoey
      // effect.
      this.createAmplifier(audioCtx, 0.6, duration),

      // The amplified output is sent to the browser to be played
      // aloud.
      audioCtx.destination]);
  }
  chain(soundNodes) {
    for (let i = 0; i < soundNodes.length - 1; i++) {
      soundNodes[i].connect(soundNodes[i + 1]);
    }
  };


}
