import React, { Component } from 'react';
import { CircularInput, CircularTrack, CircularProgress, CircularThumb } from 'react-circular-input';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cutoff: 0,
            res: 0,
            filterType: this.props.filters.LOWPASS
        };
    }

    setValue = (newValue, item) => {
        this.setState({
            [item]: newValue,
        }, () => {
            this.props.updateParent(this.state, "filter");
        });
    }

    setFilter = (filterInd) => {
        let filter;
        switch (filterInd) {
            case 0:
                filter = this.props.filters.LOWPASS;
                break;
            case 1:
                filter = this.props.filters.HIGHPASS;
                break;
            case 2:
                filter = this.props.filters.BANDPASS;
                break;
            case 3:
                filter = this.props.filters.NOTCH;
                break;
            case 4:
                filter = this.props.filters.ALLPASS;
                break;
            default:
                filter = this.props.filters.LOWPASS;
                break;
        }
        this.setState({
            filterType: filter,
        }, () => {
            this.props.updateParent(this.state, "filter");
        });
    }

    render() {

        return (
            <>
                <h3>Filter</h3>
                <div style={{ width: "90%", height: "90%", margin: "auto" }}>
                    <div>
                        <CircularInput value={this.state.cutoff} onChange={(val) => this.setValue(val, "cutoff")} radius={40}>
                            <CircularTrack style={{ strokeWidth: 10 }} />
                            <CircularProgress style={{ strokeWidth: 10 }} />
                            <CircularThumb r={13} />
                        </CircularInput>
                        <h5 style={{ marginTop: 5, }}>Cutoff</h5>
                    </div>
                    <div style={{ minWidth: "60%", marginTop: 25 }}>
                        <CircularInput value={this.state.res} onChange={(val) => this.setValue(val, "res")} radius={25}>
                            <CircularTrack style={{ strokeWidth: 8 }} />
                            <CircularProgress style={{ strokeWidth: 8 }} />
                            <CircularThumb r={8} />
                        </CircularInput>
                        <h5 style={{ marginTop: 5, }}>Resonance</h5>
                    </div>
                    <div style={{ minWidth: "60%" }}>
                        <Slider
                            min={0}
                            max={4}
                            defaultValue={0}
                            step={1}
                            marks={{
                                0: this.props.filters.LOWPASS,
                                1: this.props.filters.HIGHPASS,
                                2: this.props.filters.BANDPASS,
                                3: this.props.filters.NOTCH,
                                4: this.props.filters.ALLPASS
                            }}
                            onChange={(val) => this.setFilter(val)}
                        />
                    </div>
                </div>
            </>
        );
    }
}