import React, { Component } from 'react';
import ControlPanel from './ControlPanel';

var WaveShapes = {
    SINE: 'sine',
    SAW: 'sawtooth',
    TRIANGLE: 'triangle',
    SQUARE: 'square'
};

var FilterTypes = {
    LOWPASS: 'lowpass',
    HIGHPASS: 'highpass',
    BANDPASS: 'bandpass',
    NOTCH: 'notch',
    ALLPASS: 'allpass'
}

var LFOTarget = {
    FILTER: 'cutoff',
    PITCH: 'detune',
    SHAPE: 'shape',
    OUTPUT: 'volume'
}

export default class MidiInput extends Component {
    constructor(props) {
        super(props);
        this.activeNotes = [];
        this.ac = new AudioContext();
        this.gain1 = this.ac.createGain();
        this.gain2 = this.ac.createGain();
        this.noiseGain = this.ac.createGain();
        this.noiseBuffer = this.ac.createBufferSource();
        this.filter = this.ac.createBiquadFilter();
        this.state = {
            inputs: '',
            outputs: '',
            controlState: '',
        };
    }

    componentDidMount() {
        navigator.requestMIDIAccess()
            .then(this.onMIDISuccess, this.onMIDIFailure);
        this.gain1.connect(this.filter);
        this.gain2.connect(this.filter);
        this.noiseGain.connect(this.filter);
        this.filter.connect(this.ac.destination);

        this.noiseBufferInit();
        this.filterInit();
    }

    filterInit() {
        this.filter.type = "lowpass";
        this.filter.frequency.setValueAtTime(0, this.ac.currentTime);
        this.filter.Q.setValueAtTime(0, this.ac.currentTime);
    }

    noiseBufferInit() {
        let bufferSize = 4 * this.ac.sampleRate,
            whiteNoise = this.ac.createBuffer(1, bufferSize, this.ac.sampleRate),
            output = whiteNoise.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer.buffer = whiteNoise;
        this.noiseBuffer.loop = true;
        this.noiseBuffer.start();
    }

    onMIDISuccess = (midiAccess) => {
        this.setState({
            inputs: midiAccess.inputs,
            outputs: midiAccess.outputs,
        }, () => {
            if (this.state.inputs.size > 0) {
                this.props.changeParentState("connected", true);
            } else {
                this.props.changeParentState("connected", false);
            }
            for (let input of this.state.inputs.values()) {
                input.onmidimessage = this.getMIDIMessage;
            }
        });
    }

    getMIDIMessage = (midiMessage) => {
        if (midiMessage.data && midiMessage.data[0] >> 4 === 9) {
            let note = midiMessage.data[1];
            if (!this.activeNotes[note]) {
                let osc1 = this.ac.createOscillator();
                let osc2 = this.ac.createOscillator();
                osc1.frequency.value = this.frequencyFromPitch(note, 1);
                osc2.frequency.value = this.frequencyFromPitch(note, 2);
                osc1.start();
                osc2.start();
                let message = { "on": true, "velocity": midiMessage.data[2], "oscillator1": osc1, "oscillator2": osc2 };
                this.activeNotes[note] = message
            } else {
                this.activeNotes[note].on = true;
            }
            this.startOscillate(note);
        } else if (midiMessage.data && midiMessage.data[0] >> 4 === 8) {
            let note = midiMessage.data[1];
            this.activeNotes[note].on = false;
            this.stopOscillate(note);
        }
    }

    onMIDIFailure = () => {
        console.log("Could not access devices")
    }

    frequencyFromPitch = (pitch, osc = 1) => {
        return (Math.pow(2, ((pitch - 69 + (this.state.controlState[`osc${osc}`].octave * 12)) / 12)) * 440) + ((this.state.controlState[`osc${osc}`].pitch * 100) - 50);
    }

    startOscillate = (note) => {
        if (this.activeNotes[note]) {
            this.startOscillatorInd(note, 1);
            this.startOscillatorInd(note, 2);
            this.noiseBuffer.connect(this.noiseGain);
        }
    }

    startOscillatorInd = (note, osc) => {
        this.activeNotes[note][`oscillator${osc}`].frequency.value = this.frequencyFromPitch(note, osc);
        this.activeNotes[note][`oscillator${osc}`].type = this.state.controlState[`osc${osc}`].wave;
        this.activeNotes[note][`oscillator${osc}`].connect(this[`gain${osc}`]);
    }

    stopOscillate = (note) => {
        this.activeNotes[note].oscillator1.disconnect();
        this.activeNotes[note].oscillator2.disconnect();
        if (!this.activeNotes.some((item) => { return item.on === true; })) {
            this.noiseBuffer.disconnect();
        }
    }

    setValue = (newValue, field) => {
        this.setState({
            [field]: newValue,
        }, () => {

            this.gain1.gain.value = this.state.controlState.mixer.mix1;
            this.gain2.gain.value = this.state.controlState.mixer.mix2;
            this.noiseGain.gain.value = this.state.controlState.mixer.noise * .1;
            this.filter.frequency.setValueAtTime((this.state.controlState.filter.cutoff * ((this.ac.sampleRate / 2) - 10)) + 10, this.ac.currentTime);
            this.filter.Q.setValueAtTime((this.state.controlState.filter.res * 500), this.ac.currentTime);
            this.filter.type = this.state.controlState.filter.filterType;
        });
    }

    render() {
        return (
            <div>
                <button onClick={() => { this.ac.resume() }}>thing</button>
                <ControlPanel updateParent={this.setValue} waves={WaveShapes} filters={FilterTypes} lfoTargets={LFOTarget} />
            </div>
        );
    }
}
