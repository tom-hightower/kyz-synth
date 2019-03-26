import React, { Component } from 'react';
import { CircularInput, CircularTrack, CircularProgress, CircularThumb } from 'react-circular-input';
import Slider from 'rc-slider';
import sine from '../../resources/img/sine.svg';
import square from '../../resources/img/square.svg';
import triangle from '../../resources/img/triangle.svg';
import saw from '../../resources/img/saw.svg';
import 'rc-slider/assets/index.css';

export default class Oscillator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pitch: 0.5,
            shape: 0.5,
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
        const waveShape = (wave) => {
            switch(wave) {
                case 'sine':
                    return <img src={sine} alt="sine" style={{ width:"200%" }} />;
                case 'saw':
                return <img src={saw} alt="sine" style={{ width:"200%" }} />;
                case 'triangle':
                return <img src={triangle} alt="sine" style={{ width:"200%" }} />
                case 'square':
                return <img src={square} alt="sine" style={{ width:"200px" }} />;
                default:
                    return '0';
            }
        }

        const largeComponent = (
            <div style={{ display: "flex", width: "90%", margin: "auto", paddingTop: "5%" }}>
                <div style={{ width: "30%", padding: "0 5%", marginTop: "-5%" }} >
                    <h5 style={{ margin: 0, marginBottom: 10 }}>Octave:</h5>
                    <Slider
                        min={-2}
                        defaultValue={0}
                        max={1}
                        step={1}
                        marks={{ "-2": "-2", "-1": "-1", "0": "0", "1": "1" }}
                        vertical
                        style={{ minHeight: 200 }}
                        onChange={(val) => this.setValue(val, "octave")}
                    />
                </div>
                <div style={{ width: "30%", padding: "0 5%", marginTop: "-5%" }}>
                    <h5 style={{ margin: 0, marginBottom: 10 }}>Wave:</h5>
                    <Slider
                        min={0}
                        max={3}
                        defaultValue={2}
                        step={1}
                        marks={{ 0: waveShape('sine'), 1: waveShape('saw'), 2: waveShape('triangle'), 3: waveShape('square') }}
                        vertical
                        style={{ minHeight: 200 }}
                        onChange={(val) => this.setValue(val, "wave")}
                    />
                </div>
                <div style={{ width: "30%", display: "block", padding: "0 20%" }}>
                    <CircularInput value={this.state.pitch} onChange={(val) => this.setValue(val, "pitch")} radius={25}>
                        <CircularTrack style={{ strokeWidth: 8 }} />
                        <CircularProgress style={{ strokeWidth: 8 }} />
                        <CircularThumb r={8} />
                    </CircularInput>
                    <h5 style={{ marginTop: 10, marginBottom: "60%" }}>Detuning</h5>
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
            <div style={{ display: "flex", height: "90%" }}>
                <div style={{ width: "20%", height: "90%", margin: "auto", marginLeft: "15%", marginBottom: "5%" }}>
                    <h5 style={{ margin: 0, marginBottom: 10 }}>Octave:</h5>
                    <Slider
                        min={-2}
                        defaultValue={0}
                        max={1}
                        step={1}
                        marks={{ "-2": "-2", "-1": "-1", "0": "0", "1": "1" }}
                        vertical
                        onChange={(val) => this.setValue(val, "octave")}
                    />
                </div>
                <div style={{ width: "80%", display: "block", margin: "auto", marginLeft: "25%" }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ width: "50%" }} >
                            <CircularInput value={this.state.pitch} onChange={(val) => this.setValue(val, "pitch")} radius={25}>
                                <CircularTrack style={{ strokeWidth: 8 }} />
                                <CircularProgress style={{ strokeWidth: 8 }} />
                                <CircularThumb r={8} />
                            </CircularInput>
                            <h5 style={{ marginTop: 10, }}>Detuning</h5>
                        </div>
                        <div style={{ width: "50%" }}>
                            <CircularInput value={this.state.shape} onChange={(val) => this.setValue(val, "shape")} radius={25}>
                                <CircularTrack style={{ strokeWidth: 8 }} />
                                <CircularProgress style={{ strokeWidth: 8 }} />
                                <CircularThumb r={8} />
                            </CircularInput>
                            <h5 style={{ marginTop: 10, }}>Shape</h5>
                        </div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                        <h5>Wave:</h5>
                        <Slider
                            min={0}
                            max={3}
                            defaultValue={0}
                            step={1}
                            marks={{ 0: 0, 1: 1, 2: 2, 3: 3 }}
                            style={{ minWidth: 200, margin: "auto", marginLeft: 15 }}
                            onChange={(val) => this.setValue(val, "wave")}
                        />
                    </div>
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