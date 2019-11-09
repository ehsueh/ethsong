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

  async special() {
    const audioCtx = new AudioContext()
    const root = audioCtx.createOscillator()
    const third = audioCtx.createOscillator()
    const fifth = audioCtx.createOscillator()
    root.type = "triangle"
    third.type = "triangle"
    fifth.type = "triangle"

    root.frequency.value = this.notes[0]
    root.start()
    root.stop(audioCtx.currentTime + 0.5);

    third.frequency.value = this.notes[2]
    third.start(0.4)
    third.stop(audioCtx.currentTime + 0.9);

    fifth.frequency.value = this.notes[4]
    fifth.start(0.2)
    fifth.stop(audioCtx.currentTime + 0.7);

    this.chain([
      root,
      this.createAmplifier(audioCtx, 0.3, 0.5),
      audioCtx.destination
    ])
    this.chain([
      third,
      this.createAmplifier(audioCtx, 0.3, 0.5),
      audioCtx.destination
    ])
    this.chain([
      fifth,
      this.createAmplifier(audioCtx, 0.3, 0.5),
      audioCtx.destination
    ])
  }

  async bad() {
    const audioCtx = new AudioContext()
    const root = audioCtx.createOscillator()
    const fifth = audioCtx.createOscillator()
    root.type = "square"
    fifth.type = "square"

    root.frequency.value = this.notes[0]
    root.start()
    root.stop(audioCtx.currentTime + 0.5);

    fifth.frequency.value = 369.99
    fifth.start()
    fifth.stop(audioCtx.currentTime + 0.5);

    this.chain([
      root,
      this.createAmplifier(audioCtx, 0.3, 0.5),
      audioCtx.destination
    ])
    this.chain([
      fifth,
      this.createAmplifier(audioCtx, 0.3, 0.5),
      audioCtx.destination
    ])
  }

  async sing(value, instrument = 1) {
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

    sine.frequency.value = this.notes[note]
    sine.start()
    sine.stop(audioCtx.currentTime + duration);
    square.frequency.value = this.notes[note]
    square.start()
    square.stop(audioCtx.currentTime + duration);

    this.chain([
      sine,
      this.createAmplifier(audioCtx, 0.5, duration),
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
