import React, { Component, Fragment } from 'react';
import { Layout } from 'antd';
import ButtonStream from './streams/ButtonStream';

const { Content } = Layout;

class HocStreamDemo extends Component {

  render () {
    return (
      <Fragment>
        <p style={{color: '#aeaeae'}}>复杂交互示例</p>
        <Content>
          <ButtonStream />
        </Content>
      </Fragment>
    );
  }
}

export default HocStreamDemo;
