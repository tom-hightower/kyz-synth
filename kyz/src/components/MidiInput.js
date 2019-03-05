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
        this.activeNotes = 0;
        this.ac = new AudioContext();
        this.gain1 = this.ac.createGain();
        this.gain2 = this.ac.createGain();
        this.noiseGain = this.ac.createGain();
        this.noiseBuffer = this.ac.createBufferSource();
        this.filter = this.ac.createBiquadFilter();
        this.masterGain = this.ac.createGain();
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
        this.filter.connect(this.masterGain);
        this.masterGain.connect(this.ac.destination);

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
            this.activeNotes += 1;
            this.startOscillate(note, midiMessage.data[2]);
        } else if (midiMessage.data && midiMessage.data[0] >> 4 === 8) {
            let note = midiMessage.data[1];
            if (note) {
                this.activeNotes -= 1;
                if (this.activeNotes < 1) {
                    this.activeNotes = 0;
                    this.noiseBuffer.disconnect();
                }
            }
        }
    }

    onMIDIFailure = () => {
        console.log("Could not access devices")
    }

    frequencyFromPitch = (pitch, osc = 1) => {
        return (Math.pow(2, ((pitch - 69 + (this.state.controlState[`osc${osc}`].octave * 12)) / 12)) * 440) + ((this.state.controlState[`osc${osc}`].pitch * 100) - 50);
    }

    startOscillate = (note, velocity) => {
        let adsr = {
            "a": this.state.controlState.envelope.attack / 1000,
            "d": this.state.controlState.envelope.decay / 1000,
            "s": this.state.controlState.envelope.sustain / 1000,
            "r": this.state.controlState.envelope.release / 1000,
            "sustain": this.state.controlState.envelope.sustain / 1000,
            "ct": this.ac.currentTime
        }
        if (this.activeNotes === 1) {
            this.noiseBuffer.connect(this.noiseGain);
        }
        this.startOscillatorInd(note, 1, adsr);
        this.startOscillatorInd(note, 2, adsr);
    }

    startOscillatorInd = (note, oscInd, adsr) => {
        let osc = this.ac.createOscillator();
        osc.frequency.value = this.frequencyFromPitch(note, 2);
        osc.type = this.state.controlState[`osc${oscInd}`].wave;
        let adsrGain = this.ac.createGain();
        osc.connect(adsrGain);
        adsrGain.connect(this[`gain${oscInd}`]);
        osc.start();

        adsrGain.gain.setValueAtTime(0, adsr.ct);
        adsrGain.gain.linearRampToValueAtTime(1, adsr.ct + adsr.a);
        adsrGain.gain.linearRampToValueAtTime(adsr.sustain, adsr.ct + adsr.a + adsr.d);
        adsrGain.gain.linearRampToValueAtTime(adsr.sustain, adsr.ct + adsr.a + adsr.d + adsr.s);
        adsrGain.gain.linearRampToValueAtTime(0, adsr.ct + adsr.a + adsr.d + adsr.s + adsr.r);
        osc.stop(adsr.ct + adsr.a + adsr.d + adsr.s + adsr.r);
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
            this.masterGain.gain.value = this.state.controlState.envelope.volume;
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
