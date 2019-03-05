import React, { Component } from 'react';
import { CircularInput, CircularTrack, CircularProgress, CircularThumb } from 'react-circular-input';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class LFO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rate: 0,
            int: 0,
            target: this.props.lfoTargets.FILTER
        };
    }

    setValue = (newValue, item) => {
        this.setState({
            [item]: newValue,
        }, () => {
            this.props.updateParent(this.state, "lfo");
        });
    }

    setTarget = (targetInd) => {
        let targetBlock;
        switch (targetInd) {
            case 0:
                targetBlock = this.props.lfoTargets.FILTER;
                break;
            case 1:
                targetBlock = this.props.lfoTargets.PITCH;
                break;
            case 2:
                targetBlock = this.props.lfoTargets.SHAPE;
                break;
            case 3:
                targetBlock = this.props.lfoTargets.OUTPUT;
                break;
            default:
                targetBlock = this.props.lfoTargets.FILTER;
                break;
        }
        this.setState({
            target: targetBlock,
        }, () => {
            this.props.updateParent(this.state, "lfo");
        });
    }

    render() {

        return (
            <>
                <h3>LFO - unimplemented</h3>
                <div style={{ width: "90%", height: "90%", margin: "auto" }}>
                    <div style={{ display: "flex", marginTop: "15%", marginBottom: "15%" }} >
                        <div style={{ width: "50%" }}>
                            <CircularInput value={this.state.cutoff} onChange={(val) => this.setValue(val, "cutoff")} radius={35}>
                                <CircularTrack style={{ strokeWidth: 10 }} />
                                <CircularProgress style={{ strokeWidth: 10 }} />
                                <CircularThumb r={12} />
                            </CircularInput>
                            <h5 style={{ marginTop: 5, }}>Frequency</h5>
                        </div>
                        <div style={{ width: "50%" }}>
                            <CircularInput value={this.state.res} onChange={(val) => this.setValue(val, "res")} radius={35}>
                                <CircularTrack style={{ strokeWidth: 10 }} />
                                <CircularProgress style={{ strokeWidth: 10 }} />
                                <CircularThumb r={12} />
                            </CircularInput>
                            <h5 style={{ marginTop: 5, }}>Intensity</h5>
                        </div>
                    </div>
                    <div style={{ minWidth: "60%" }}>
                        <Slider
                            min={0}
                            max={3}
                            defaultValue={0}
                            step={1}
                            marks={{
                                0: this.props.lfoTargets.FILTER,
                                1: this.props.lfoTargets.PITCH,
                                2: this.props.lfoTargets.SHAPE,
                                3: this.props.lfoTargets.OUTPUT
                            }}
                            onChange={(val) => this.setTarget(val)}
                        />
                    </div>
                </div>
            </>
        );
    }
}