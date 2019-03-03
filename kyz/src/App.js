import React, { Component } from 'react';
import './App.css';
import MidiInput from './components/MidiInput';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connected: false,
        };
    }

    handleChange = (field, state) => {
        this.setState({
            [field]: state,
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>kyz Synth</p>
                    {this.state.connected ? "Synth Connected" : "No Midi Device Detected"}
                </header>
                <div className="App-body">
                    <MidiInput changeParentState={this.handleChange} />
                </div>
            </div>
        );
    }
}
