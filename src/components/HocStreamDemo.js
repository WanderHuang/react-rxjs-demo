import React, { Component, Fragment } from 'react';
import { Layout } from 'antd';
import ButtomStream from './streams/ButtomStream';

const { Content } = Layout;

class HocStreamDemo extends Component {

  render () {
    return (
      <Fragment>
        <p style={{color: '#aeaeae'}}>复杂交互示例</p>
        <Content>
          <ButtomStream />
        </Content>
      </Fragment>
    );
  }
}

export default HocStreamDemo;
