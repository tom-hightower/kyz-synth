import React, { Component } from 'react';

const VisualizerModes = {
    WAVE: 0,
};

export default class AudioVisualizer extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            mode: VisualizerModes.WAVE,
            wave: {
                showSpindle: true
            }
        };
    }

    componentDidUpdate() {
        switch (this.state.mode) {
            case VisualizerModes.WAVE:
                this.drawWave();
                break;
            default:
                this.drawWave();
                break;

        }
    }

    drawWave() {
        const { audioData } = this.props;
        const canvas = this.canvas.current;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        let spindle = this.state.wave.showSpindle ? .8 : 1;
        let x = 0;
        const sliceWidth = (width * 1.0) / audioData.length;
        context.lineWidth = 2;
        context.strokeStyle = '#000000';
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.moveTo(0, height / 2);
        for (const item of audioData) {
            const y = (item / 255.0) * height;
            context.lineTo(x * spindle, y);
            x += sliceWidth;
        }
        context.lineTo(x, height / 2);
        context.stroke();
    }

    render() {

        return (
            <>
                <h3>Audio Visualizer</h3>
                <canvas width="600" height="300" ref={this.canvas} />
            </>
        );
    }
}