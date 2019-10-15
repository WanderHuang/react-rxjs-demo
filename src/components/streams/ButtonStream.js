import React, { Component } from 'react'
import { Button, message } from 'antd';

import { withStream } from '../../rx/hoc';
import { tap, pluck, filter, take } from 'rxjs/operators';
import { interval } from 'rxjs';

/**
 * 单个组件内状态循环
 * Hoc ===(mapStateToProps, mapActionToProps)===> ButtonStream ======> props ===stream$===> stream$.subscribe(next => ) ======> Hoc
 */
class ButtonStream extends Component {

  componentDidMount () {
    const { stream$ } = this.props;
    stream$.pipe(
      pluck('news'),
      tap(console.log),
      filter((value, index) => index > 0)
    ).subscribe((news) => {
      message.info(news);
    })
  }


  
  render () {
    const { buttonClicked, ob1, ob2 } = this.props;
    return (
      <Button onClick={buttonClicked}>{ob1}点我{ob2}</Button>
    );
  }
}

// 很酷
// 把流映射到props上，实现`响应式`的属性
const observable1$ = interval(5000).pipe(take(5));
const observable2$ = interval(1000).pipe(take(20));
const mapStateToProps = () => ({ news: 0, ob1: observable1$, ob2: observable2$ });
const mapActionToProps = (state, stream$) => {
  return {
    buttonClicked (e) {
      stream$.next({news: Math.random()});
    }
  }
}

export default withStream(mapStateToProps, mapActionToProps)(ButtonStream);
