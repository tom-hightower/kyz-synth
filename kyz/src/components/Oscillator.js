import React, { Component } from 'react';

export default class Oscillator extends Component {
    Oscillate(frequency) {
        var ac = new AudioContext();
        var osc = ac.createOscillator();
        osc.connect(ac.destination);
        // Set the oscillator parameters
        osc.frequency.value = frequency;
        osc.type = "sawtooth";
        // Play a sound for 2 seconds
        osc.start();
        osc.stop(ac.currentTime + .25);
    }

    render() {
        return (
            <div>
                <button onClick={() => this.Oscillate(this.props.frequency)}>Oscillate</button>
            </div>
        );
    }
}
