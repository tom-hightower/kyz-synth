import React, { Component } from 'react';
import ControlPanel from './ControlPanel';

var WaveShapes = {
    SINE: 'sine',
    SAW: 'sawtooth',
    TRIANGLE: 'triangle',
    SQUARE: 'square'
};

export default class MidiInput extends Component {
    constructor(props) {
        super(props);
        this.activeNotes = [];
        this.ac = new AudioContext();
        this.state = {
            inputs: '',
            outputs: '',
            controlState: '',
        };
    }

    componentDidMount() {
        navigator.requestMIDIAccess()
            .then(this.onMIDISuccess, this.onMIDIFailure);

    }

    onMIDISuccess = (midiAccess) => {
        this.setState({
            inputs: midiAccess.inputs,
            outputs: midiAccess.outputs,
        }, () => {
            if (this.state.inputs.values().length > 0) {
                this.props.changeParentState("connected", true);
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
                let osc = this.ac.createOscillator();
                osc.frequency.value = this.frequencyFromPitch(note);
                osc.start();
                let message = { "velocity": midiMessage.data[2], "oscillator": osc };
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
            this.activeNotes[note].oscillator.frequency.value = this.frequencyFromPitch(note);
            this.activeNotes[note].oscillator.type = this.state.controlState.osc1.wave;
            console.log(this.activeNotes[note].oscillator)
            this.activeNotes[note].oscillator.connect(this.ac.destination)
        }
    }

    stopOscillate = (note) => {
        this.activeNotes[note].oscillator.disconnect()
        console.log(this.activeNotes[note].oscillator)
    }

    setValue = (newValue, field) => {
        this.setState({
            [field]: newValue,
        });
    }

    render() {
        return (
            <div>
                <ControlPanel updateParent={this.setValue} waves={WaveShapes} />
            </div>
        );
    }
}
