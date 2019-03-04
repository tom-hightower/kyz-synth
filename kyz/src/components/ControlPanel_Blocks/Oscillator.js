import React, { Component } from 'react';
import { CircularInput, CircularTrack, CircularProgress, CircularThumb } from 'react-circular-input';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class Oscillator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pitch: 0.5,
            shape: 0.5,
            wave: this.props.waves.SINE,
            octave: 0,
        };
    }

    setValue = (newValue, item) => {
        if (item === "wave") {
            switch (newValue) {
                case 0:
                    newValue = this.props.waves.SINE;
                    break;
                case 1:
                    newValue = this.props.waves.SAW;
                    break;
                case 2:
                    newValue = this.props.waves.TRIANGLE;
                    break;
                case 3:
                    newValue = this.props.waves.SQUARE;
                    break;
                default:
                    break;
            }
        }
        this.setState({
            [item]: newValue,
        }, () => {
            this.props.updateParent(this.state, `osc${this.props.id}`);
        });
    }

    render() {

        const largeComponent = (
            <div style={{ display: "flex" }}>
                <div>
                    <Slider
                        min={-2}
                        defaultValue={0}
                        max={1}
                        step={1}
                        marks={{ "-2": "-2", "-1": "-1", "0": "0", "1": "1" }}
                        vertical
                        style={{ minHeight: 200, marginLeft: 20 }}
                        onChange={(val) => this.setValue(val, "octave")}
                    />
                </div>
                <div>
                    <Slider
                        min={0}
                        max={3}
                        defaultValue={0}
                        step={1}
                        marks={{ 0: 0, 1: 1, 2: 2, 3: 3 }}
                        vertical
                        style={{ minHeight: 200, marginLeft: 75 }}
                        onChange={(val) => this.setValue(val, "wave")}
                    />
                </div>
                <div style={{ marginLeft: 100 }}>
                    <CircularInput value={this.state.pitch} onChange={(val) => this.setValue(val, "pitch")} radius={25}>
                        <CircularTrack style={{ strokeWidth: 8 }} />
                        <CircularProgress style={{ strokeWidth: 8 }} />
                        <CircularThumb r={8} />
                    </CircularInput>
                    <h5 style={{ marginTop: 10, }}>Detuning</h5>
                    <br />
                    <CircularInput value={this.state.shape} onChange={(val) => this.setValue(val, "shape")} radius={25}>
                        <CircularTrack style={{ strokeWidth: 8 }} />
                        <CircularProgress style={{ strokeWidth: 8 }} />
                        <CircularThumb r={8} />
                    </CircularInput>
                    <h5 style={{ marginTop: 10, }}>Shape</h5>
                </div>
            </div>
        );

        const smallComponent = (
            <div style={{ display: "flex" }}>
                <div>
                    <Slider
                        min={-2}
                        defaultValue={0}
                        max={1}
                        step={1}
                        marks={{ "-2": "-2", "-1": "-1", "0": "0", "1": "1" }}
                        vertical
                        style={{ minHeight: 200, marginLeft: 20 }}
                        onChange={(val) => this.setValue(val, "octave")}
                    />
                </div>
                <div style={{ marginLeft: 10 }}>
                    <CircularInput value={this.state.pitch} onChange={(val) => this.setValue(val, "pitch")} radius={25}>
                        <CircularTrack style={{ strokeWidth: 8 }} />
                        <CircularProgress style={{ strokeWidth: 8 }} />
                        <CircularThumb r={8} />
                    </CircularInput>
                    <h5>Detuning</h5>
                </div>
                <div style={{ marginLeft: 10 }}>
                    <CircularInput value={this.state.shape} onChange={(val) => this.setValue(val, "shape")} radius={25}>
                        <CircularTrack style={{ strokeWidth: 8 }} />
                        <CircularProgress style={{ strokeWidth: 8 }} />
                        <CircularThumb r={8} />
                    </CircularInput>
                    <h5>Shape</h5>
                </div>
                <div style={{ width: "100%" }}>
                    <Slider
                        min={0}
                        max={3}
                        defaultValue={0}
                        step={1}
                        marks={{ 0: 0, 1: 1, 2: 2, 3: 3 }}
                        style={{ minWidth: 200, marginLeft: 75 }}
                        onChange={(val) => this.setValue(val, "wave")}
                    />
                </div>
            </div>
        );

        return (
            <>
                <h3>Oscillator {this.props.id}</h3>
                {this.props.small ? smallComponent : largeComponent}
            </>
        );
    }
}