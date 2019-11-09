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

  createAmplifier(audio, startValue, duration) {
    const amplifier = audio.createGain();
    this.rampDown(audio, amplifier.gain, startValue, duration);
    return amplifier;
  };

  rampDown(audio, value, startValue: number, duration: number) {
    value.setValueAtTime(startValue, audio.currentTime);
    value.exponentialRampToValueAtTime(0.01, audio.currentTime + duration);
  };

  async sing(value, duration = 1) {
    const audioCtx = new AudioContext();
    const sine = audioCtx.createOscillator();

    let note

    if (value < 0.1) {
      note = 0
    }
    else if (value < 0.5) {
      note = 1
    }
    else if (value < 1) {
      note = 2
    }
    else {
      note = 3
    }
    
    note = note * 2 + this.progression[this.chord]
    if (note > 7) {
      note -= 8
    }

    sine.frequency.value = this.notes[note]
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
    this.counter++;
    if (this.counter % 4 == 0){
      this.chord++;
    }
    if (this.chord > 3) this.chord = 0;
  }
  chain(soundNodes) {
    for (let i = 0; i < soundNodes.length - 1; i++) {
      soundNodes[i].connect(soundNodes[i + 1]);
    }
  };


}
