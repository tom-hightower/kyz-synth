import React, { Component } from 'react';

const noteLookup = {
    qwerty: {
        'a': 60,
        'w': 61,
        's': 62,
        'e': 63,
        'd': 64,
        'f': 65,
        't': 66,
        'g': 67,
        'y': 68,
        'h': 69,
        'u': 70,
        'j': 71,
        'k': 72,
    },
    dvorak: {
        'a': 60,
        ',': 61,
        'o': 62,
        '.': 63,
        'e': 64,
        'u': 65,
        'y': 66,
        'i': 67,
        'f': 68,
        'd': 69,
        'g': 70,
        'h': 71,
        't': 72,
    }
}

export default class HandleSoftKeys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: 'qwerty',
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', event => {
            if (event.defaultPrevented || (this.lastEvent && this.lastEvent.key === event.key)) {
                return;
            }
            this.lastEvent = event;
            this.props.playNote(noteLookup[this.state.layout][event.key], 128);
        });
        document.addEventListener('keyup', event => {
            this.lastEvent = null;
        });
    }

    render() {
        return (
            <select name="cars" value={this.state.layout} onChange={(event) => this.setState({ layout: event.target.value })}>
                <option value="qwerty">Qwerty</option>
                <option value="dvorak">Dvorak</option>
            </select>
        );
    }
}