import React, { Component } from 'react';
import { CircularInput, CircularTrack, CircularProgress, CircularThumb } from 'react-circular-input';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class Mixer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mix1: 0.5,
            mix2: 0.5,
            noise: 0,
        };
    }

    setValue = (newValue, item) => {
        this.setState({
            [item]: newValue,
        }, () => {
            this.props.updateParent(this.state, "mixer");
        });
    }

    setMix = (newValue) => {
        this.setState({
            mix1: (1 - newValue),
            mix2: newValue,
        }, () => {
            this.props.updateParent(this.state, "mixer");
        });
    }

    render() {

        return (
            <>
                <h3>Mixer</h3>
                <div style={{ width: "90%", display: "flex", height: "90%" }}>
                    <div>
                        <CircularInput value={this.state.noise} onChange={(val) => this.setValue(val, "noise")} radius={25}>
                            <CircularTrack style={{ strokeWidth: 8 }} />
                            <CircularProgress style={{ strokeWidth: 8 }} />
                            <CircularThumb r={8} />
                        </CircularInput>
                        <h5 style={{ marginTop: 10, }}>Noise</h5>
                    </div>
                    <div style={{ minWidth: "60%", marginTop: 40 }}>
                        <Slider
                            min={0}
                            max={1}
                            defaultValue={0.5}
                            step={0.1}
                            marks={{ 0: '', 0.1: '', 0.2: '', 0.3: '', 0.4: '', 0.5: '', 0.6: '', 0.7: '', 0.8: '', 0.9: '', 1: '' }}
                            onChange={(val) => this.setMix(val)}
                        />
                    </div>
                </div>
            </>
        );
    }
}