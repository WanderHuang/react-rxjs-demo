import React, { Component, Fragment } from 'react'
import { Layout, Col, Row } from 'antd';

import Calculator from './biz/Calculator';

const { Content } = Layout;

class CommunicateDemo extends Component {

  constructor (props) {
    super(props);

    // ref
    this.refClub = React.createRef();

    // bind
    this.onAdamChange = this.onAdamChange.bind(this);
    this.onBobChange = this.onBobChange.bind(this);

  }

  onAdamChange (value) {
    this.refClub.current.onAdamChange(value);
  }
  onBobChange (value) {
    this.refClub.current.onBobChange(value);
  }

  render () {
    return (
      <Fragment>
        <p style={{color: '#aeaeae'}}>组件通信示例</p>
        <Content>
          <Row>
            <Col span={12}>
              <Calculator onChange={this.onAdamChange}/>
            </Col>
            <Col span={12}>
              <Calculator onChange={this.onBobChange}/>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Calculator ref= {this.refClub}/>
            </Col>
          </Row>
        </Content>
      </Fragment>
    )
  }
}

export default CommunicateDemo;