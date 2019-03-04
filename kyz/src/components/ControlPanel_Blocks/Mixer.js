import React, { Component } from 'react';
import { CircularInput, CircularTrack, CircularProgress, CircularThumb } from 'react-circular-input';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class Mixer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mix: 0.5,
            noise: 0,
        };
    }

    setValue = (newValue, item) => {
        this.setState({
            [item]: newValue,
        }, () => {
            this.props.updateParent(this.state.mix, "mix2");
            this.props.updateParent(1 - this.state.mix, "mix1");
            this.props.updateParent(this.state.noise, "noise");
        });
    }

    render() {

        return (
            <>
                <h3>Mixer</h3>
                <CircularInput value={this.state.noise} onChange={(val) => this.setValue(val, "noise")} radius={20}>
                    <CircularTrack style={{ strokeWidth: 10 }} />
                    <CircularProgress style={{ strokeWidth: 10 }} />
                    <CircularThumb r={10} />
                </CircularInput>
                <h5>Noise</h5>
                <Slider
                    min={0}
                    max={1}
                    defaultValue={0.5}
                    step={0.1}
                    marks={{ 0: '', 0.1: '', 0.2: '', 0.3: '', 0.4: '', 0.5: '', 0.6: '', 0.7: '', 0.8: '', 0.9: '', 1: '' }}
                    style={{ minWidth: 100 }}
                    onChange={(val) => this.setValue(val, "mix")}
                />
            </>
        );
    }
}