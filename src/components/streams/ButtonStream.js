import React, { Component } from 'react'
import { Button, message } from 'antd';

import { withStream } from '../../rx/hoc';
import { tap, pluck, filter, map } from 'rxjs/operators';
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
    const { buttonClicked } = this.props;
    return (
      <Button onClick={buttonClicked}>点我</Button>
    );
  }
}

const mapStateToProps = () => ({ news: 0 });
const mapActionToProps = (state, stream$) => {
  return {
    buttonClicked (e) {
      stream$.next({news: Math.random()});
    }
  }
}
const observable1$ = interval(1000);
const observable2$ = interval(1000).pipe(map(value => ((value * Math.random()) | 0)));

export default withStream(mapStateToProps, mapActionToProps)(ButtonStream);
