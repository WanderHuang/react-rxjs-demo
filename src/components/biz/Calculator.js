import React, { Component } from 'react';
import { List, Row, Col, InputNumber } from 'antd';

import { withStream } from '../../rx/hoc';
import { retryAjax } from '../../rx/operators';

class Calculator extends Component {

  constructor(props) {
    super(props);

    // bind
    this.onAdamChange = this.onAdamChange.bind(this);
    this.onBobChange = this.onBobChange.bind(this);
  }

  onAdamChange (value) {
    const { numBob, onNumAdamChange } = this.props;
    onNumAdamChange(value);
    this.appendLogs('adam', value);
    this.onChange(numBob + value);
  }

  onBobChange (value) {
    const { numAdam, onNumBobChange } = this.props;
    onNumBobChange(value);
    this.appendLogs('bob', value);
    this.onChange(numAdam + value);
  }

  appendLogs(id, value) {
    const { onLogAppend } = this.props;
    retryAjax(`/calculator/${id}`, { id, value })(onLogAppend).subscribe(onLogAppend);
  }

  // 对外暴露变化
  onChange (value) {
    const { onChange = () => {} } = this.props;
    onChange(value);
  }

  render () {
    const { numAdam, numBob, logs, total } = this.props;
    const { onAdamChange, onBobChange } = this;
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Row>
          <Col span={4}>
            <InputNumber key="adam" value={numAdam} onChange={onAdamChange}></InputNumber>
          </Col>
          <Col span={4}>
            <span>+</span>
          </Col>
          <Col span={4}>
          <InputNumber key="bob" value={numBob} onChange={onBobChange}></InputNumber>
          </Col>
          <Col span={4}>
            <span>=</span>
          </Col>
          <Col span={4}>
            <span>{total}</span>
          </Col>
        </Row>
        <div style={{height: '40vh', overflow: 'auto'}}>
          <List
            header={<div>操作日志</div>}
            bordered
            dataSource={logs}
            renderItem={item => (
              <List.Item>
                {item}
              </List.Item>
            )}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {
    numAdam: 0,
    numBob: 0,
    logs: [],
    total: 0
  }
}
const mapActionsToProps = (state, stream$) => {
  return {
    onNumAdamChange (value) {
      const { numBob } = state;
      stream$.next({ numAdam: value, total: numBob + value });
    },
    onNumBobChange (value) {
      const { numAdam } = state;
      stream$.next({ numBob: value, total: numAdam + value });
    },
    onLogAppend (message) {
      const { logs = [] } = state;
      logs.push(message);
      stream$.next({ logs });
    }
  }
}

export default withStream(mapStateToProps, mapActionsToProps)(Calculator);