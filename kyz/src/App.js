import React, { Component } from 'react';
import './App.css';
import MidiInput from './components/MidiInput';

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>kyz Synth</p>
                </header>
                <div className="App-body">
                    <MidiInput />
                </div>
            </div>
        );
    }
}
