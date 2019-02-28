import React, { Component } from 'react';
import ControlPanel from './ControlPanel';

export default class MidiInput extends Component {
    constructor(props) {
        super(props);
        //this.checkNotes = setInterval(this.updateNotes, 10)
        this.activeNotes = [];
        this.ac = new AudioContext();
        this.state = {
            inputs: '',
            outputs: '',
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

    frequencyFromPitch = (pitch) => {
        return Math.pow(2, ((pitch - 69) / 12)) * 440;
    }

    startOscillate = (note) => {
        if (this.activeNotes[note]) {
            this.activeNotes[note].oscillator.type = "sawtooth";
            console.log(this.activeNotes[note].oscillator)
            this.activeNotes[note].oscillator.connect(this.ac.destination)
        }
    }

    stopOscillate = (note) => {
        this.activeNotes[note].oscillator.disconnect(this.ac.destination)
        console.log(this.activeNotes[note].oscillator)
    }

    render() {
        return (
            <div>
                <ControlPanel />
            </div>
        );
    }
}
