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

  async sing(value, instrument = 0) {
    const audioCtx = new AudioContext()
    const sine = audioCtx.createOscillator()
    const square = audioCtx.createOscillator()
    square.type = "square"

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

    let duration = 1
    if (this.counter == 0){
      duration = 3
    }

    console.log(this.progression[this.chord])
    sine.frequency.value = this.notes[note]
    sine.start()
    sine.stop(audioCtx.currentTime + duration);
    square.frequency.value = this.notes[note]
    square.start()
    square.stop(audioCtx.currentTime + duration);

    this.chain([
      sine,
      this.createAmplifier(audioCtx, 0.4, duration),
      audioCtx.destination
    ])

    if (instrument == 1) {
      this.chain([
        square,
        this.createAmplifier(audioCtx, 0.01, duration),
        audioCtx.destination
      ])
    }

    this.counter++;
    if (this.counter == 4) {
      this.chord++;
      this.counter = 0
    }
    if (this.chord > 3) this.chord = 0;
  }
  chain(soundNodes) {
    for (let i = 0; i < soundNodes.length - 1; i++) {
      soundNodes[i].connect(soundNodes[i + 1]);
    }
  };
}
