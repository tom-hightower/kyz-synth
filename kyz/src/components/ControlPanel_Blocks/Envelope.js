import React, { Component } from 'react';
import { CircularInput, CircularTrack, CircularProgress, CircularThumb } from 'react-circular-input';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const adsrStyle = {
    width: "10%",
    margin: "auto",
};

const adsrHeaderStyle = {
    textAlign: "left",
    marginTop: 0
}

export default class Envelope extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attack: 0,
            decay: 511,
            sustain: 511,
            release: 0,
            volume: 0.25,
        };
    }

    setValue = (newValue, item) => {
        this.setState({
            [item]: newValue,
        }, () => {
            this.props.updateParent(this.state, "envelope");
        });
    }

    render() {

        const volStepValue = (v) => Math.round(v * 200) / 200;

        return (
            <>
                <h3>VCA</h3>
                <div style={{ width: "90%", height: "90%", display: "flex" }}>
                    <div style={adsrStyle} >
                        <h5 style={adsrHeaderStyle}>A</h5>
                        <Slider
                            min={0}
                            value={this.state.attack}
                            max={1023}
                            step={1}
                            vertical
                            style={{ minHeight: 200 }}
                            onChange={(val) => this.setValue(val, "attack")}
                        />
                    </div>
                    <div style={adsrStyle}>
                        <h5 style={adsrHeaderStyle}>D</h5>
                        <Slider
                            min={0}
                            max={1023}
                            value={this.state.decay}
                            step={1}
                            vertical
                            style={{ minHeight: 200 }}
                            onChange={(val) => this.setValue(val, "decay")}
                        />
                    </div>
                    <div style={adsrStyle}>
                        <h5 style={adsrHeaderStyle}>S</h5>
                        <Slider
                            min={0}
                            max={1023}
                            value={this.state.sustain}
                            step={1}
                            vertical
                            style={{ minHeight: 200 }}
                            onChange={(val) => this.setValue(val, "sustain")}
                        />
                    </div>
                    <div style={adsrStyle}>
                        <h5 style={adsrHeaderStyle}>R</h5>
                        <Slider
                            min={0}
                            max={1023}
                            value={this.state.release}
                            step={1}
                            vertical
                            style={{ minHeight: 200 }}
                            onChange={(val) => this.setValue(val, "release")}
                        />
                    </div>
                    <div style={{ width: "60%" }}>
                        <div>
                            <CircularInput value={volStepValue(this.state.volume) * 2} onChange={(val) => this.setValue(volStepValue(val) / 2, "volume")} radius={40}>
                                <CircularTrack style={{ strokeWidth: 10 }} />
                                <CircularProgress style={{ strokeWidth: 10 }} />
                                <CircularThumb r={10} />
                                <text x={40} y={40} textAnchor="middle" dy="0.3em" fontWeight="bold">
                                    {Math.round(volStepValue(this.state.volume) * 2 * 100)}%
		                        </text>
                            </CircularInput>
                            <h5 style={{ marginTop: 5, }}>Volume</h5>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}