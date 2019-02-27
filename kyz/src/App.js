import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Oscillator from './components/Oscillator';
import MidiInput from './components/MidiInput';

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <Oscillator frequency={440}/>
                    <Oscillator frequency={554}/>
                    <Oscillator frequency={659}/>
                    <MidiInput />
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        );
    }
}
