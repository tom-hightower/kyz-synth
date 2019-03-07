import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import './component-style/ControlPanel.css';
import Oscillator from './ControlPanel_Blocks/Oscillator';
import Mixer from './ControlPanel_Blocks/Mixer';
import Filter from './ControlPanel_Blocks/Filter';
import LFO from './ControlPanel_Blocks/LFO';
import Envelope from './ControlPanel_Blocks/Envelope';
import AudioVisualizer from './ControlPanel_Blocks/AudioVisualizer';

export default class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            osc1: {
                pitch: 0.5,
                shape: 0.5,
                wave: this.props.waves.SINE,
                octave: 0,
            },
            osc2: {
                pitch: 0.5,
                shape: 0.5,
                wave: this.props.waves.SINE,
                octave: 0,
            },
            mixer: {
                mix1: 0.5,
                mix2: 0.5,
                noise: 0,
            },
            filter: {
                cutoff: 0,
                res: 0,
                filterType: this.props.filters.LOWPASS
            },
            lfo: {
                rate: 0,
                int: 0,
                target: this.props.lfoTargets.FILTER
            },
            envelope: {
                attack: 0,
                decay: 511,
                sustain: 511,
                release: 0,
                volume: 0.5,
            }
        };
    }

    componentDidMount() {
        this.props.updateParent(this.state, "controlState");
    }

    setValue = (newValue, field) => {
        this.setState({
            [field]: newValue,
        }, () => {
            this.props.updateParent(this.state, "controlState");
        });
    }

    render() {
        return (
            <div className="ControlBox">
                <Grid fluid>
                    <Row style={{ minHeight: 350 }}>
                        <Col xs={12} sm={12} md={5} lg={3} className="border" >
                            <Oscillator id={1} waves={this.props.waves} updateParent={this.setValue} />
                        </Col>
                        <Col xs={12} sm={12} md={7} lg={4}>
                            <Row className="border-med">
                                <Oscillator id={2} waves={this.props.waves} updateParent={this.setValue} small />
                            </Row>
                            <Row className="border-mini">
                                <Mixer updateParent={this.setValue} />
                            </Row>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={2.5} className="border">
                            <Filter updateParent={this.setValue} filters={this.props.filters} />
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={2.5} className="border">
                            <LFO updateParent={this.setValue} lfoTargets={this.props.lfoTargets} />
                        </Col>
                    </Row>
                    <Row style={{ minHeight: 350 }}>
                        <Col xs={12} sm={12} md={8} lg={6} className="border">
                            <Envelope updateParent={this.setValue} />
                        </Col>
                        <Col xs={0} sm={0} md={4} lg={6} className="border">
                            { this.props.audioData ? <AudioVisualizer audioData={this.props.audioData} /> : '' }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
