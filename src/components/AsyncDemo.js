import React, { Component, Fragment } from 'react'
import { Layout, Button, List, Row } from 'antd';
import { retryAjax } from '../rx/operators';

import { BehaviorSubject, of } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';


const { Content } = Layout;

class AsyncDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDatas: []
    }

    // 设定默认值的多播主体；订阅立即获取到最新值
    this.sub$ = new BehaviorSubject();

    // bind
    this.onSaveLog = this.onSaveLog.bind(this);
    this.onClearLog = this.onClearLog.bind(this);
    this.appendListDatas = this.appendListDatas.bind(this);
  }

  componentDidMount () {
    // 操作分别为
    // 过滤：去掉无效值
    // 合流：映射为新的流
    // 合流：触发日志事件
    this.sub$.pipe(
      filter(e => e),
      mergeMap((data) => of(`${data}`)),
      mergeMap((e) => this.fromSaveLog(e))
    ).subscribe((data) => {
      this.appendListDatas(data);
    })
  }
  
  // 更新list
  appendListDatas (message) {
    console.log(message);
    this.setState({ listDatas: [...this.state.listDatas, message] })
  }

  // 生成日志流 含有重试机制
  fromSaveLog (payload) {
    return retryAjax('/saveLog.htm', payload)(this.appendListDatas, this.appendListDatas);
  }
  
  // 清除日志流
  fromClearLog (payload) {
    return retryAjax('/clearLog.htm', payload)(this.appendListDatas, this.appendListDatas);
  }

  // 保存日志
  onSaveLog (e) {
    const log$ = this.fromSaveLog(`save log`);
    log$.subscribe((res) => {
      this.appendListDatas(res);
    })
  }

  // 清除日志
  onClearLog (e) {
    const clear$ = this.fromClearLog(`clear log`);
    clear$.subscribe((res) => {
      this.setState({ listDatas: [res] })
    })
  }

  // 视图层产生流 不做业务处理
  render () {
    const { listDatas } = this.state;
    return (
      <Fragment>
        <p style={{color: '#aeaeae'}}>负责异步数据流 业务功能带联动性</p>
        <Content>
          <Row>
            <Button onClick={(e) => this.sub$.next('button-1')}>点击事件1</Button>
            <Button onClick={(e) => this.sub$.next('button-2')}>点击事件2</Button>
            <Button onClick={this.onSaveLog}>保存日志</Button>
            <Button onClick={this.onClearLog}>清除日志</Button>
          </Row>
          <List
            header={<div>历史记录</div>}
            bordered
            dataSource={listDatas}
            renderItem={item => (
              <List.Item>
                {item}
              </List.Item>
            )}
          />
        </Content>
      </Fragment>
    )
  }
}

export default AsyncDemo;