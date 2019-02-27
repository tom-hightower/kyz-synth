import React, { Component } from 'react';

export default class MidiInput extends Component {
    constructor(props) {
        super(props);
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
        console.log(midiAccess)

        this.setState({
            inputs: midiAccess.inputs,
            outputs: midiAccess.outputs,
        }, () => {
            for (let input of this.state.inputs.values()) {
                console.log(input);
                input.onmidimessage = this.getMIDIMessage;
            }
        });
    }

    getMIDIMessage = (midiMessage) => {
        if (midiMessage.data && midiMessage.data[0] >> 4 === 9 ) {
            console.log("Note On:")
            console.log(midiMessage);
        } else if (midiMessage.data && midiMessage.data[0] >> 4 === 8) {
            console.log("Note Off")
        }
    }

    onMIDIFailure = () => {
        console.log("Could not access devices")
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}
