import React, { Component, Fragment } from 'react'
import { Layout } from 'antd';
import '../styles/block.css';
import { fromEvent } from 'rxjs';
import { map, takeUntil, delay } from 'rxjs/operators'

const { Content } = Layout;

class DragDemo extends Component {

  constructor (props) {
    super(props);

    this.state = {
      origin: {
        x: 0,
        y: 0
      }
    }

    // bind
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  // 实现拖动跟随
  onMouseDown(e) {
    const delayTime = 600;
    const { clientX, clientY } = e;
    const { origin } = this.state;
    const blocks = document.querySelectorAll('.rx-block');
    const mousePos$ = fromEvent(window, 'mousemove').pipe(
      map(e => ({
        x: e.clientX - clientX + origin.x,
        y: e.clientY - clientY + origin.y
      })),
      takeUntil(fromEvent(window, 'mouseup'))
    );

    // 块跟随
    blocks.forEach((block, index) => {
      mousePos$.pipe(
        delay(delayTime * Math.pow(0.7, index))
      ).subscribe(({x, y}) => {
        block.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      })
    });
    // 记录原始位置
    mousePos$.subscribe(origin => {
      this.setState({ origin });
    })
  }

  render () {
    return (
      <Fragment>
        <p style={{color: '#aeaeae'}}>拖动DIV示例</p>
        <Content>
          <div className="rx-block red"></div>
          <div className="rx-block blue"></div>
          <div className="rx-block red"></div>
          <div className="rx-block blue"></div>
          <div className="rx-block red"></div>
          <div className="rx-block blue"></div>
          <div className="rx-block red"></div>
          <div className="rx-block blue"></div>
          <div
            className="rx-block green"
            onMouseDown={this.onMouseDown}
          ></div>
        </Content>
      </Fragment>
    )
  }
}

export default DragDemo;